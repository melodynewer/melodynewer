let { handleText } = require("./func");
let finRoutine = handleText("subway.txt");
let sregexOne =
  /\*可换乘+(APM线|广佛线|(\d|\d\d)号线知识城支线|(3号线北延段)|(\d|\d\d)号线)/g;
let sregexTwo = /\、+((\d|\d\d)号线|APM线|广佛线|14号线知识城支线)/g;
let lastWay = finRoutine.replace(sregexOne, "");
let finWay = lastWay.replace(sregexTwo, "");
console.log("一级处理后文件信息为\n" + finRoutine);
console.log("=====================");
console.log("最终处理后文件信息为\n" + finWay);
