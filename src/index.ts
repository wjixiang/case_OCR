import BaiduOCR from "./baiduOCR";
import * as path from 'path'
import * as fs from 'fs'

export interface casePTTrequest {
    folderPath: string;
    BAIDU_APIKEY: string;
    SECRET_KEY: string;
    // sortFn:(fileName:string)=>
}

export class caseOCR implements casePTTrequest{
    folderPath: string;
    BAIDU_APIKEY: string;
    SECRET_KEY: string;

    constructor(req:casePTTrequest){
        this.folderPath = req.folderPath
        this.BAIDU_APIKEY = req.BAIDU_APIKEY
        this.SECRET_KEY = req.SECRET_KEY
    }

    async imgCollectionToText(){
        const files = Array.from(fs.readdirSync(this.folderPath)).filter(this.isImageFile)
        console.log(files)
        const ocr = new BaiduOCR(await BaiduOCR.getAccessToken(this.BAIDU_APIKEY,this.SECRET_KEY))
        return files.map(async (fileName)=>{
            const imgPath = path.join(this.folderPath,fileName)
            return await ocr.generalOCR(
                ocr.fileToBase64(fs.readFileSync(imgPath))
            )
        })
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
        const res_list = await Promise.all(await this.imgCollectionToText())
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
