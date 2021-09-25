//引入接口函数
var paperpass = require("./func");
//引入读取写入文件模块
let fs = require("fs");
//引入词库
let nodejieba = require("nodejieba");
let argument = process.argv.splice(2);
let orig = argument[0];
let orig_copy = argument[1];
// 读取文件
let file1 = fs.readFileSync(orig, "UTF-8").toString();
let file2 = fs.readFileSync(orig_copy, "UTF-8").toString();
// 对文件内容中的逗号等符号进行屏蔽
paperpass.string(file1, file2);
// 把文件内容以逗号分割成一个数组
let data1 = file1.split("。");
let data2 = file2.split("。");
let minDataLen = Math.min(data1.length - 1, data2.length - 1);
for (var i = 0; i < minDataLen; i++) {
  // 对数组的每个元素(即一句话)进行分词
  var result1 = nodejieba.tag(data1[i]);
  var result2 = nodejieba.tag(data2[i]);
  console.log(result1);
  console.log(result2);
}
