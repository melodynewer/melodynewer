// 处理文本内容函数
function handleText(file) {
  //引入读取写入文件模块
  const fs = require("fs");
  let oriFile = fs.readFileSync(file, "UTF-8").toString();
  return oriFile.replace(/@/g, "*可换乘").replace(/\r/g, "");
}
// 查询路线函数
function searchWay(way, firstArg, thirdArg, flag) {
  const fs = require("fs");
  for (let i in way) {
    let lastRoutine = way[i].split("-");
    if (firstArg == lastRoutine[0]) {
      flag = 1;
      for (let j in lastRoutine) {
        if (j == 0) {
          // 添加路线内容到指定文件
          fs.writeFileSync(
            thirdArg,
            lastRoutine[j] + "包含的站点有：" + "\n\n"
          );
        } else {
          // 追加路线内容到指定文件
          fs.appendFileSync(thirdArg, lastRoutine[j] + "\n\n");
        }
      }
      console.log("该路线已写入文件！");
    }
  }
  if (flag == 0) {
    fs.writeFileSync(thirdArg, "未找到该路线！");
    console.log("未找到该路线！");
  }
}
// 地铁站点类，包含站点名及所在路线
class Station {
  constructor(station, line) {
    this.stationName = station;
    this.lineName = line;
  }
}
// 地铁路线无向图类，包含各节点及它们之间的关系
class Graph {
  constructor(nodes) {
    this.nodes = nodes; //保存所有节点
    this.line = {}; //保存所有节点关系
    this.res = []; //最短路径结果
    this.hasRes = false; //是否 至少有一个可以到达的路径
  }
  // 添加节点之间关系的函数
  addLine(v, w) {
    this._addLine(v, w);
    this._addLine(w, v);
  }
  // 添加单个节点关系的函数
  _addLine(g, h) {
    !this.line[g.stationName] && (this.line[g.stationName] = []);
    this.line[g.stationName].push(h);
  }
  // 求得最短路径的入口函数
  minPath(v, w) {
    for (let i in this.nodes) {
      if (this.nodes[i].stationName === v) {
        var start = this.nodes[i];
        break;
      }
    }
    let tempResult = [start];
    // console.log(this.line["万胜围"]);
    this.step(this.line[v], tempResult, w);
    return this.res;
    // console.log(tempResult);
  }
  // 求得最短路径的核心函数
  step(adjacentNodes, tempRes, w) {
    //当前节点没有相邻节点
    if (adjacentNodes.length == 0) {
      return;
    }
    //存在可以到达的路径，并且该路径比正在探测的路径短则直接退出探测
    if (this.hasRes && this.res.length < tempRes.length) {
      return;
    }
    adjacentNodes.forEach((item) => {
      //当前探测的点已经走过了，不再重复走
      for (let i in tempRes) {
        if (tempRes[i].stationName == item.stationName) return;
      }
      let newTempRes = tempRes.concat(item);
      //到达终点
      if (item.stationName === w) {
        if (this.hasRes) {
          if (newTempRes.length < this.res.length) {
            //已有最短路径，且比当前路径更短，替换
            this.res = newTempRes;
          }
        } else {
          //目前没有最短路径，替换
          this.res = newTempRes;
          this.hasRes = true;
        }
      } else {
        this.step(this.line[item.stationName], newTempRes, w);
      }
    });
  }
  // 得到所有站点名
  data() {
    return this.nodes;
  }
}
// 得到最终规划路线
function finalRoutine(firstArg, secondArg, graph, forthArg) {
  // 引入文件读写模块
  const fs = require("fs");
  // 得到所有的站点名，方便后续进行数据处理
  let stationInfo = graph.data();
  // 得到最短路径，该路径上的信息为站点的名字和所在路线，方便后续进行数据处理
  let result = graph.minPath(firstArg, secondArg);
  // 得到第一个站点名
  let startStation = result[0].stationName;
  // 得到第二个站点所在路线名
  let secondLine = result[1].lineName;
  let secondLines = [];
  let num = 0;
  // 得到第二个站点所在路线上的所有站点
  for (let i = 0; i < stationInfo.length - 1; i++) {
    if (stationInfo[i].lineName == secondLine) {
      secondLines[num++] = stationInfo[i];
      if (stationInfo[i + 1].lineName != secondLine) break;
    }
  }
  // 当第二个站点所在路线上有第一个站点名，则起始路线为第二个站点所在路线，减少不必要的换乘
  for (let i in secondLines) {
    if (secondLines[i].stationName == startStation) {
      result[0].lineName = secondLine;
      break;
    }
  }
  // 最终的路线数组，格式为路线+站点名，而不是一个站点的所有信息
  let plan = [];
  let temp = result[0].lineName;
  plan[0] = temp;
  for (let i in result) {
    if (result[i].lineName == temp) {
      plan.push(result[i].stationName);
    } else {
      temp = result[i].lineName;
      plan.push(temp, result[i].stationName);
    }
  }
  for (let i in plan) {
    if (i == 0) {
      fs.writeFileSync(forthArg, plan[i] + "\n\n");
    } else {
      fs.appendFileSync(forthArg, plan[i] + "\n\n");
    }
  }
  console.log("规划路线已写入文件" + forthArg);
}
module.exports = { handleText, searchWay, Station, Graph, finalRoutine };
