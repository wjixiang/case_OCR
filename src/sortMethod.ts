import * as path from 'path'

export const sortByLast:(fileNameA:string,fileNameB:string)=> number = (fileNameA,fileNameB)=>{
    const numA = parseInt(fileNameA.replace(path.extname(fileNameA),"").slice(-6))
    const numB = parseInt(fileNameB.replace(path.extname(fileNameA),"").slice(-6))
    return numA-numB
}