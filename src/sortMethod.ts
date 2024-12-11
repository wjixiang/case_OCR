import * as path from 'path'

export const sortByLast:(fileNameA:string,fileNameB:string)=> number = (fileNameA,fileNameB)=>{
    const numA = parseInt(fileNameA.replace("_"+path.extname(fileNameA),"").slice(-4))
    const numB = parseInt(fileNameB.replace("_"+path.extname(fileNameA),"").slice(-4))
    return numA-numB
}

export const sortByName:(fileNameA:string,fileNameB:string)=> number = (fileNameA,fileNameB)=>{
    const numA = parseInt(fileNameA)
    const numB = parseInt(fileNameB)
    return numA-numB
}