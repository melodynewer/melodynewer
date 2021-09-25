//引入接口函数
var paperpass = require("./func");
//引入读取写入文件模块
let fs = require("fs");
//引入词库
let nodejieba = require("nodejieba");
//获取命令行参数数组，并处理异常情况
let argument = process.argv.splice(2);
let orig = argument[0];
let orig_copy = argument[1];
let answer = argument[2];
if (argument.length != 3) {
  console.log(
    "检测到参数个数错误，提示：需输入原文、抄袭文、答案三个文件的路径！！！"
  );
  return false;
}
if (
  orig.slice(orig.length - 4, orig.length) != ".txt" ||
  orig_copy.slice(orig_copy.length - 4, orig_copy.length) != ".txt" ||
  answer.slice(answer.length - 4, answer.length) != ".txt"
) {
  console.log("检测到参数形式错误，提示：文件后缀不要忘");
  return false;
}
// 读取文件
let file1 = fs.readFileSync(orig, "UTF-8").toString();
let file2 = fs.readFileSync(orig_copy, "UTF-8").toString();
// 对文件内容中的逗号等符号进行屏蔽
file1 = paperpass.string(file1);
file2 = paperpass.string(file2);
// 把文件内容以逗号分割成一个数组
let data1 = file1.split("。");
let data2 = file2.split("。");
let minDataLen = Math.min(data1.length - 1, data2.length - 1);
let maxDataLen = Math.max(data1.length - 1, data2.length - 1);
let all = 0;
let average = 0;
// 对两个文档内容的每一句话进行边境距离的对比
// 第一个for循环是按照句数安排对比次数
for (var i = 0; i < minDataLen; i++) {
  // 对数组的每个元素(即一句话)进行分词
  let result1 = nodejieba.tag(data1[i]);
  let result2 = nodejieba.tag(data2[i]);
  let minResLen = Math.min(result1.length, result2.length);
  let maxResLen = Math.max(result2.length, result2.length);
  // 第二个for循环是按照一句话的长度安排对比次数
  for (var k = 0; k < minResLen; k++) {
    let res1 = result1[k];
    let res2 = result2[k];
    if (res1.tag == res2.tag) {
      all += paperpass.levenshteinDistance(res1.word, res2.word);
    }
  }
  // 如果一个文档里的一句话要比另一个文档里的一句话要都短，则总编辑距离要加上一句话多的字符数
  for (let p = 0; p < maxResLen - minResLen; p++) {
    if (result1.length < result2.length) {
      all += result2[minResLen + p].word.length;
    } else {
      all += result1[minResLen + p].word.length;
    }
  }
}
// 如果一个文档要比另一个文档少一句话，则总编辑距离要加上多的那句话的字符数
for (let j = 1; j < maxDataLen - minDataLen + 1; j++) {
  if (data1.length < data2.length) {
    all += data2[minDataLen + j].length;
  } else {
    all += data1[minDataLen + j].length;
  }
}
// 重复率即为1-(总编辑距离除以长文档内容的字符数)
average = paperpass.calculate(all, file1, file2);
// 把重复率写入答案文件
fs.writeFile(answer, average + "%", null, (err) => {
  if (err) {
    console.log(err);
    return console.log("写入失败");
  }
  console.log("重复率已被写入答案文件中");
});
