// 引入assert断言模块
var assert = require("assert").strict;

// 简单的封装assert.equal
function test(response, obj, status = 200) {
  assert.equal(JSON.stringify(response.data), JSON.stringify(obj));
  assert.equal(response.status, status);
}
// 构建测试模型
describe("My Test Module", function () {
  describe("#indexOf1()", function () {
    it("should return -1 when the value is not present", function () {
      // 以下内容为planning.js里的内容，测试的是planning.js的代码能否正常运行和它的性能
      const {
        handleText,
        searchWay,
        Station,
        Graph,
        finalRoutine,
      } = require("./func");
      //获取命令行参数数组，并处理异常情况
      let argument = process.argv.splice(2);
      let firstArg = argument[0];
      let secondArg = argument[1];
      let thirdArg = argument[2];
      let forthArg = argument[3];
      // 判断所查询路线是否存在的变量
      let flag = 0;
      // 判断规划路线时输入的是否是站点名
      let fregex = /(\d|\d\d)+号线|APM线|广佛线|14号线知识城支线$/;
      // 处理地铁路线文件内容为替换@为换乘以及去掉\r符号的字符串
      let finRoutine = handleText("subway.txt");
      // 将字符串依照换行符分成一条条地铁路线到数组中
      let way = finRoutine.split("\n");
      // 判断换乘线路
      let sregexOne = /\*可换乘+((\d|\d\d)号线|APM线|广佛线|14号线知识城支线)/g;
      let sregexTwo = /\、+((\d|\d\d)号线|APM线|广佛线|14号线知识城支线)/g;
      // 将字符串中的换乘标识文字去除，利于规划线路，最后得到只包含站点信息的各条路线
      let lastWay = finRoutine.replace(sregexOne, "");
      let finWay = lastWay.replace(sregexTwo, "").split("\n");
      // 需求1：打印所有路线
      if (argument.length == 1 && firstArg == "subway.txt") {
        console.log("广州地铁路线如下：\n" + finRoutine);
      }
      // 需求2：查询路线
      else if (
        argument.length == 3 &&
        secondArg == "subway.txt" &&
        thirdArg.slice(thirdArg.length - 4, thirdArg.length) == ".txt"
      ) {
        searchWay(way, firstArg, thirdArg, flag);
      }
      // 需求3：规划最短路径（经过站点最少）
      else if (
        argument.length == 4 &&
        thirdArg == "subway.txt" &&
        forthArg.substring(forthArg.length - 4) == ".txt" &&
        fregex.test(firstArg) == false &&
        fregex.test(secondArg) == false
      ) {
        for (let i in finWay) {
          finWay[i] = finWay[i].split("-");
        }
        // 将地铁路线上的所有站点录入到graphArray数组中
        let graphArray = [];
        for (let i in finWay) {
          for (let j = 1; j < finWay[i].length; j++) {
            let station = new Station(finWay[i][j], finWay[i][0]);
            graphArray.push(station);
          }
        }
        // 构造地铁路线无向图
        let graph = new Graph(graphArray);
        let index = 0;
        for (let j in finWay) {
          for (let k = 0; k < finWay[j].length - 2; k++) {
            graph.addLine(graphArray[index], graphArray[index + 1]);
            if (k == finWay[j].length - 3) {
              index += 2;
            } else {
              index++;
            }
          }
        }
        finalRoutine(firstArg, secondArg, graph, forthArg);
      }
      // else {
      //   console.log(
      //     `请输入正确的需求参数个数及格式！
      // 若要查询全部路线，则参数为路线文件；
      // 若要查询某一地铁路线，则参数按顺序为路线名、路线文件和写入文件名；
      // 若要规划路线，则参数按顺序为为起始站点、末站点和写入文件名、路线文件名和写入文件名。`
      //   );
      // }
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
    it("should return 0 when the value is not present", function () {
      assert.equal([4, 2, 3, 1].indexOf(4), 0);
    });
  });
});
