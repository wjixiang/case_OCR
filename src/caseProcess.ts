import { AIClient,AIRequest,message } from './aiClient';
import config from './config';


export default class caseProcess{
    AIClient: AIClient
    data: string[]
    constructor(rawData:string[]){
        this.data = rawData
        this.AIClient = new AIClient(config.get_API_URL(),config.get_API_KEY())
    }

    async preprocess(){
        
        // console.log("current data:",this.data)
        const slicedData = this.divide(this.data)
        this.data = await Promise.all(slicedData.map(async preConcatSet=>{
            if(preConcatSet.length <= 1){
                return preConcatSet[0]
            }else{
                return await this.AIconcat(preConcatSet[0],preConcatSet[1])
            }
        }))
        
        return this.data
    }

    autoConcat(firstText: string,secondText: string){
        const firstTextArray = firstText.split(/,|，|。|\n/g)
        const secondTextArray = secondText.split(/,|，|。|\n/g)
        console.log(firstTextArray)
        console.log(secondTextArray)
        return "test"
    }

    levenshteinSimilarity(str1: string, str2: string): number {  
        if (str1 === str2) return 1.0;  
        if (str1.length === 0 || str2.length === 0) return 0.0;  
    
        const distance = this.levenshteinDistance(str1, str2);  
        const maxLength = Math.max(str1.length, str2.length);  
        return 1 - (distance / maxLength);  
    }

    levenshteinDistance(str1: string, str2: string): number {  
        // 确保str1是较短的字符串，优化空间复杂度  
        if (str1.length > str2.length) {  
            [str1, str2] = [str2, str1];  
        }  
    
        let prevRow: number[] = Array.from({ length: str2.length + 1 }, (_, i) => i);  
        let currRow: number[] = Array(str2.length + 1);  
    
        for (let i = 0; i < str1.length; i++) {  
            currRow[0] = i + 1;  
    
            for (let j = 0; j < str2.length; j++) {  
                const cost = str1[i] === str2[j] ? 0 : 1;  
                currRow[j + 1] = Math.min(  
                    currRow[j] + 1,              // 插入  
                    prevRow[j + 1] + 1,          // 删除  
                    prevRow[j] + cost            // 替换  
                );  
            }  
    
            [prevRow, currRow] = [currRow, prevRow];  
        }  
    
        return prevRow[str2.length];  
    }  

    private divide(dataArray:string[]):string[][]{
        const result:string[][] = []
        for (let i = 0; i < dataArray.length; i += 2) {  
            result.push(dataArray.slice(i, i + 2));  
        }  
        return result
    }


    AIconcat(firstText: string,secondText: string){
        const req: AIRequest = {
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: '你是一个智能病历ocr后处理器, 处理用户先后输入的两段原始病历OCR文本, 删除重复部分合并为一段, 并删除异常的文本及额外识别到的系统界面文本, 结果要求尽可能多的保留原始OCR本文, 不要有你自己的描述'
                },
                {
                    role: 'user',
                    content: `${firstText}\n\n---------------\n\n${secondText}`
                }
            ]
        }

        return this.AIClient.call(req)
    }
}