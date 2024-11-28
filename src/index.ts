import { caseOCR, caseOCRrequest } from "./caseOCR";
import caseProcess from "./caseProcess";
import config from "./config";
import { sortByLast } from "./sortMethod";
import * as fs from 'fs';

const name = ['入院记录','出院记录','病程记录']

async function generate(name:string){
    const req:caseOCRrequest = {
        folderPath: `/Users/a123/Desktop/test/肾病综合征/${name}`,
        BAIDU_APIKEY: config.get_BAIDU_APIKEY(),
        SECRET_KEY: config.get_SECRET_KEY(),
        ConcurrencyLimit:10,
        sortFn: sortByLast,
    }
    const convertor = new caseOCR(req)
    const RawTextArray = await convertor.getRawText()
    const processer = new caseProcess(RawTextArray)
    const completeCase:string[] = await processer.preprocess()
    fs.writeFileSync(`.export/肾综-${name}.txt`,completeCase.join("\n"))
}



async function start(){
    for(const i of name){
        await generate(i)
    }
}


start()