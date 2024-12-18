import axios from 'axios';  
import Bottleneck from 'bottleneck'; // 引入 bottleneck  

class BaiduOCR {   
  private accessToken: string  
  private baseUrl: string = 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic';  
  private limiter: Bottleneck; // 添加限流器属性  

  constructor(  
    accessToken: string,   
    options: {  
      maxConcurrent?: number;  // 最大并发数  
      minTime?: number;         // 最小请求间隔(毫秒)  
    } = {}  
  ) {  
    this.accessToken = accessToken;  

    // 配置 Bottleneck 限流器  
    this.limiter = new Bottleneck({  
      maxConcurrent: options.maxConcurrent || 2,  // 默认最大并发2个  
      minTime: options.minTime || 200            // 默认每次请求间隔200ms  
    });  
  }  

  static async getAccessToken(client_id:string, client_secret:string){  
    const options = {  
        'method': 'POST',  
        'url': `https://aip.baidubce.com/oauth/2.0/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`,  
        'headers': {  
                'Content-Type': 'application/json',  
                'Accept': 'application/json'  
        }  
    };  

    return await axios(options)  
        .then(res => res.data.access_token)  
  }  

  /**  
   * 通用文字识别方法  
   * @param imageBase64 图片的Base64编码  
   * @returns Promise<any> OCR识别结果  
   */  
  async generalOCR(imageBase64: string): Promise<any> {  
    // 使用限流器包装请求  
    return this.limiter.schedule(async () => {  
      try {  
        // 对Base64编码进行URL编码  
        const encodedImage = encodeURIComponent(imageBase64);  

        const response = await axios.post(  
          `${this.baseUrl}?access_token=${this.accessToken}`,  
          `image=${encodedImage}`,  
          {  
            headers: {  
              'Content-Type': 'application/x-www-form-urlencoded'  
            }  
          }  
        );  

        return response.data;  
      } catch (error) {  
        console.error('OCR识别失败:', error);  
        throw error;  
      }  
    });  
  }  

  /**  
   * 从本地文件读取并转换为Base64  
   * @param file 文件对象  
   * @returns Promise<string> Base64编码  
   */  
  fileToBase64(file: Buffer): string {  
    return file.toString('base64')  
  }   
}  

export default BaiduOCR;