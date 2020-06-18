# MY课堂-后端项目

## 1. 初始化项目

### 1.1 生成package.json
```sh
npm init -y
```
### 1.2 安装依赖
- 安装生产依赖
```sh
npm i express mongoose body-parser bcryptjs jsonwebtoken morgan cors validator helmet dotenv multer -S
```
express`web服务器`
mongoose`对象模型工具`
body-parser`请求体解析中间件`
bcryptjs`加密`
jsonwebtoken`实现token的生成与反向解密出用户数据`
morgan`请求日志`
cors`解决跨域`
validator`验证`
helmet`安全防护中间件`
dotenv`加载环境变量`
multer`用于处理 multipart/form-data 类型的表单数据，它主要用于上传文件`

-  安装开发依赖
```sh
npm i typescript  @types/node @types/express @types/mongoose @types/bcryptjs @types/jsonwebtoken  @types/morgan @types/cors @types/validator ts-node-dev  @types/helmet @types/multer -D
```
```sh
npm i cross-env -D
```
```sh
# 日志分割
npm i file-stream-rotator -S 
```
```sh
npm i http-status-codes -S
```
### 1.3 初始化tsconfig.json

```sh
npx tsconfig.json

? Pick the framework you're using: 
  react 
  react-native 
❯ node 
```


### 1.4 package.json添加命令

```json
"scripts": {
  "build": "tsc",
  "start": "cross-env PORT=8000  ts-node-dev --respawn src/index.ts",
  "dev": "cross-env PORT=8000 nodemon --exec ts-node --files src/index.ts"
}
```