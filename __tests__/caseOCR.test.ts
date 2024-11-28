import { caseOCR, caseOCRrequest } from "../src/caseOCR";
import config from "../src/config";
import { sortByLast } from '../src/sortMethod';
import * as fs from 'fs';


describe("convert case imgs to texts smartly",()=>{
    const req:caseOCRrequest = {
        folderPath: "/Users/a123/Desktop/test",
        BAIDU_APIKEY: config.get_BAIDU_APIKEY(),
        SECRET_KEY: config.get_SECRET_KEY(),
        ConcurrencyLimit:10,
        sortFn: sortByLast,
    }
    
    const convertor = new caseOCR(req)
    
    test("sort files",()=>{
        const testFiles = ['IMG_20241126_175811.jpg','IMG_20241126_175813.jpg','IMG_20241126_175812.jpg']
        expect(
            convertor.sortFiles(testFiles)
        ).toEqual(['IMG_20241126_175811.jpg','IMG_20241126_175812.jpg','IMG_20241126_175813.jpg'])
    })
    
    test("schedule concurrence",()=>{
        const plan:string[][] = convertor.scheduleConcurrence()
        // console.log(plan)
        expect(plan)
    })

    test.skip("get raw text list",async()=>{
        const RawTextArray = await convertor.getRawText()
        expect(RawTextArray.length > 0).toBe(true)
        fs.writeFileSync('./testRawText.json',JSON.stringify(RawTextArray,null,2))
    },600000)

})