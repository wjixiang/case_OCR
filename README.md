# case_OCR
病历照片转完整病历

1. 批量图片OCR
2. 调用LLM的API实现异常文本去除、重叠内容去重（暂不完全）、识别结果拼接

## 使用方法
### 1. 安装依赖
```sh
npm install
```
### 2. 配置`.env`
在根目录下建立文件，命名为`.env`，输入你的百度OCR的API key以及Secret Key、OpenAI的请求地址及API密匙（支持第三方）
```sh
BAIDU_APIKEY="oxPKcZKwxx********Kwle"
SECRET_KEY="FZ8IJtj********Nn8AP4e"
AI_API_URL="https://****************"
AI_API_KEY="sk-****************"
```

### 3. 识别转换
1. 参考并调整`./src/index.ts`中的代码
2. 终端执行`npm run dev`