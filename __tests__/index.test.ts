import { caseOCR, casePTTrequest } from "../src/index";
import config from "../src/config";


describe("convert case imgs to texts smartly",()=>{
    const req:casePTTrequest = {
        folderPath: "/Users/a123/Desktop/test",
        BAIDU_APIKEY: config.get_BAIDU_APIKEY(),
        SECRET_KEY: config.get_SECRET_KEY(),
    }
    
    const convertor = new caseOCR(req)
    
    test("get raw text list",async()=>{
        const RawTextArray = await convertor.getRawText()
        expect(RawTextArray.length > 0).toBe(true)
    },60000)
})