// 获取命令行参数
let argument = process.argv.splice(2);
let orig = argument[0];
let orig_copy = argument[1];
let answer = argument[2];
// 判断参数是否齐全
if (argument.length != 3) {
  console.log("参数不全");
  return false;
}
// 判断文件后缀是否存在
if (
  orig.slice(orig.length - 4, orig.length) != ".txt" ||
  orig_copy.slice(orig_copy.length - 4, orig_copy.length) != ".txt" ||
  answer.slice(answer.length - 4, answer.length) != ".txt"
) {
  console.log("检测到参数形式错误，提示：文件后缀不要忘");
}
