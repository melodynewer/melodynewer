//获取命令行参数数组，并处理异常情况
let argument = process.argv.splice(2);
let firstArg = argument[0];
let secondArg = argument[1];
let thirdArg = argument[2];
let forthArg = argument[3];
if (argument.length == 1 && firstArg == "subway.txt") {
  console.log("正在展示所有路线");
} else if (
  argument.length == 3 &&
  secondArg == "subway.txt" &&
  thirdArg.slice(thirdArg.length - 4, thirdArg.length) == ".txt"
) {
  console.log("正在查询路线");
} else if (
  argument.length == 4 &&
  thirdArg == "subway.txt" &&
  forthArg.substring(forthArg.length - 4) == ".txt" &&
  fregex.test(firstArg) == false &&
  fregex.test(secondArg) == false
) {
  console.log("正在规划路线");
} else {
  console.log(
    `请输入正确的需求参数个数及格式！
  若要查询全部路线，则参数为路线文件；
  若要查询某一地铁路线，则参数按顺序为路线名、路线文件和写入文件名；
  若要规划路线，则参数按顺序为为起始站点、末站点和写入文件名、路线文件名和写入文件名。`
  );
}
