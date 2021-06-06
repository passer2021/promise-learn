const fs = require('fs');
const path = require('path')

//回调函数 形式
// fs.readFile('./resource/content.txt', (err, data) => {
//     // 如果出错 则抛出错误
//     if(err)  throw err;
//     //输出文件内容
//     console.log(data.toString());
// });

// __dirname是获取当前文件绝对路径的全局对象
const filePath = path.join(__dirname, './resource/content.txt')
const p = new Promise((resolve , reject) => {
  fs.readFile(filePath, (err, data) => {
    //如果出错
    if(err) reject(err)
    //如果成功
    resolve(data)
  })
})

//调用 then 
p.then(value=>{
  console.log(value.toString());
}, reason=>{
  console.log(reason);
})
