import { caseOCR, caseOCRrequest } from "./caseOCR";
import caseProcess from "./caseProcess";
import config from "./config";
import {sortByName } from "./sortMethod";
import * as fs from 'fs';

const name = fs.readdirSync("/Users/a123/Desktop/test/").reverse()
name.pop()



async function generate(name:string){
    const req:caseOCRrequest = {
        folderPath: `/Users/a123/Desktop/test/${name}`,
        BAIDU_APIKEY: config.get_BAIDU_APIKEY(),
        SECRET_KEY: config.get_SECRET_KEY(),
        ConcurrencyLimit:10,
        sortFn: sortByName,
    }
    const convertor = new caseOCR(req)
    const RawTextArray = await convertor.getRawText()
    const processer = new caseProcess(RawTextArray)
    const completeCase:string[] = await processer.preprocess()
    fs.writeFileSync(`./export/${name}.txt`,completeCase.join("\n"))
}



async function start(){
    for(const i of name){
        await generate(i)
    }
}


start()

console.log(name)