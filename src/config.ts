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
        if(process.env.AI_API_URL){
            return process.env.AI_API_URL
        }else{
            throw(new Error("未设置AI_API_URL"))
        }
    }

    static get_API_KEY():string{
        if(process.env.AI_API_KEY){
            return process.env.AI_API_KEY
        }else{
            throw(new Error("未设置AI_API_KEY"))
        }
    }
}