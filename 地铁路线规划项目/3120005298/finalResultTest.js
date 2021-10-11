let { handleText } = require("./func");
let finRoutine = handleText("subway.txt");
let sregexOne =
  /\*可换乘+(APM线|广佛线|(\d|\d\d)号线知识城支线|(3号线北延段)|(\d|\d\d)号线)/g;
let sregexTwo = /\、+((\d|\d\d)号线|APM线|广佛线|14号线知识城支线)/g;
let lastWay = finRoutine.replace(sregexOne, "");
let finWay = lastWay.replace(sregexTwo, "").split("\n");
for (let i in finWay) {
  finWay[i] = finWay[i].split("-");
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

  data() {
    return this.nodes;
  }
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
// 得到所有的站点名，方便后续进行数据处理
let stationInfo = graph.data();
// 得到最短路径，该路径上的信息为站点的名字和所在路线，方便后续进行数据处理
let result = graph.minPath("坦尾", "大学城南");
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
console.log(secondLines);
// 当第二个站点所在路线上有第一个站点名，则起始路线为第二个站点所在路线，减少不必要的换乘
for (let i in secondLines) {
  if (secondLines[i].stationName == startStation) {
    result[0].lineName = secondLine;
    break;
  }
}
console.log(result);
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
console.log(plan);
