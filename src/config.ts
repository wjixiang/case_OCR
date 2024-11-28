import * as dotenv from 'dotenv'
dotenv.config()

export default class config {
    static get_BAIDU_APIKEY():string{
        if(process.env.BAIDU_APIKEY){
            return process.env.BAIDU_APIKEY
        }else{
            throw(new Error("未设置BAIDU_APIKEY"))
        }
    }

    static get_SECRET_KEY():string{
        if(process.env.SECRET_KEY){
            return process.env.SECRET_KEY
        }else{
            throw(new Error("未设置SECRET_KEY"))
        }
    }

    static get_API_URL():string{
        if(process.env.API_URL){
            return process.env.API_URL
        }else{
            throw(new Error("未设置API_URL"))
        }
    }
}