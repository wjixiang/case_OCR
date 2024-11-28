import BaiduOCR from "./baiduOCR";
import * as path from 'path'
import * as fs from 'fs'

export interface casePTTrequest {
    folderPath: string;
    BAIDU_APIKEY: string;
    SECRET_KEY: string;
    ConcurrencyLimit: number;
    sortFn:(fileNameA:string,fileNameB:string)=>number;
}

export class caseOCR implements casePTTrequest{
    folderPath: string;
    BAIDU_APIKEY: string;
    SECRET_KEY: string;
    ConcurrencyLimit: number;
    sortFn:(fileNameA:string,fileNameB:string)=>number;

    constructor(req:casePTTrequest){
        this.folderPath = req.folderPath
        this.BAIDU_APIKEY = req.BAIDU_APIKEY
        this.SECRET_KEY = req.SECRET_KEY
        this.ConcurrencyLimit = req.ConcurrencyLimit
        this.sortFn = req.sortFn
    }

    async bulkOCR(){
        const concurrencePlan = this.scheduleConcurrence()
        const ocrResult = []

        for(const i of concurrencePlan){
            const res = await Promise.all(await this.ocr(i))
            console.log(res)
            ocrResult.push(...res)
        }
        return ocrResult

    }

    scheduleConcurrence():string[][]{
        const fileNameArray = this.getFileNameList()
        const result:string[][] = []
        for (let i = 0; i < fileNameArray.length; i += this.ConcurrencyLimit) {  
            result.push(fileNameArray.slice(i, i + this.ConcurrencyLimit));  
        }  
        return result
    }

    async ocr(files:string[]){
        const ocr = new BaiduOCR(await BaiduOCR.getAccessToken(this.BAIDU_APIKEY,this.SECRET_KEY))
        return files.map(async (fileName)=>{
            const imgPath = path.join(this.folderPath,fileName)
            return await ocr.generalOCR(
                ocr.fileToBase64(fs.readFileSync(imgPath))
            )
        })
    }

    getFileNameList(){
        /**
         * @returns fileNameList
         */
        return this.sortFiles(Array.from(fs.readdirSync(this.folderPath)).filter(this.isImageFile))
    }

    sortFiles(files:string[]){
        return files.sort(this.sortFn)
    }

    async getRawText(){
        const res_list = await this.getRawOcrRes()
        const rawTextList =  res_list.map(res=>{
            return res.words_result.map((item:{words: string})=> item.words.trim()).join('')
        })
        console.log(rawTextList)
        return rawTextList
    }

    async getRawOcrRes(){
        const res_list = await Promise.all(await this.bulkOCR())
        // console.log(res_list)
        return res_list
    }


    private isImageFile(file: string): boolean {  
        const allowedTypes = [  
            '.jpg',
            '.jpeg',
            '.png'
        ];  
        return allowedTypes.includes(path.extname(file));  
    }  
    
}
