import BaiduOCR from "./baiduOCR";
import * as path from 'path'
import * as fs from 'fs'

interface ocrResult{
    words_result: wordsResult[];
    words_result_num: number;
    log_id: number;
}

interface wordsResult {
    words: string
}

export interface caseOCRrequest {
    folderPath: string;
    BAIDU_APIKEY: string;
    SECRET_KEY: string;
    ConcurrencyLimit: number;
    sortFn:(fileNameA:string,fileNameB:string)=>number;
}

export class caseOCR implements caseOCRrequest{
    folderPath: string;
    BAIDU_APIKEY: string;
    SECRET_KEY: string;
    ConcurrencyLimit: number;
    sortFn:(fileNameA:string,fileNameB:string)=>number;

    constructor(req:caseOCRrequest){
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
            console.log("bulkOCR:",res)

            //check OCR result
            res.forEach(ocrRes=>{
                if(ocrRes.error_msg){
                    console.log('OCR error')
                    throw new Error(ocrRes.error_msg)
                }
            })

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
        const res_list:ocrResult[] = await this.getRawOcrRes()
        const rawTextList =  res_list.map(res=>{
            return res.words_result.map((item:{words: string})=> item.words.trim()).join('')
        })
        console.log("ocr result:",rawTextList)
        return rawTextList
    }

    async getRawOcrRes(){
        const res_list:ocrResult[] = await Promise.all(await this.bulkOCR())
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
