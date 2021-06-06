/**
 * util.promisify 方法
 */
//引入 util 模块
const util = require('util')
//引入 fs 模块
const fs = require('fs')
//引入path
const path = require('path')

//返回一个新的函数
let mineReadFile = util.promisify(fs.readFile)

//使用绝对路径 防止找不到文件
mineReadFile(path.join(__dirname, './resource/content.txt')).then(value=>{
    console.log(value.toString());
})