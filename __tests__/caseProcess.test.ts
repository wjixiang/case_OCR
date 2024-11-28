import caseProcess from '../src/caseProcess';
import * as fs from 'fs';


describe("process primary ocr text to complete digital case",()=>{
    const testRawText:string[] = JSON.parse(fs.readFileSync("./testRawText.json").toString())
    const processer = new caseProcess(testRawText)
    test.skip("concat method",async()=>{
        const concatResult:string = await processer.AIconcat(testRawText[2],testRawText[3])
        console.log(concatResult)
        expect(concatResult)
    })

    test("pre-process caseData",async ()=>{
        const completeCase:string[] = await processer.preprocess()
        console.log(completeCase)
        expect(completeCase)
    },600000)

    test.skip("segament concat",()=>{
        const concat_result:string = processer.autoConcat(testRawText[0],testRawText[1])
        expect(concat_result)
    })
})

