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
      // 以下内容为PaperPass.js里添加实例后的内容，测试的是PaperPass.js的代码能否正常运行和它的性能
      var paperpass = require("./func");
      var nodejieba = require("nodejieba");
      var fs = require("fs");
      let file1 = fs.readFileSync("test5/orig.txt", "UTF-8").toString();
      let file2 = fs.readFileSync("test1/orig_delete.txt", "UTF-8").toString();
      paperpass.string(file1, file2);
      var data1 = file1.split("。");
      var data2 = file2.split("。");
      let minDataLen = Math.min(data1.length - 1, data2.length - 1);
      let maxDataLen = Math.max(data1.length - 1, data2.length - 1);
      let all = 0;
      for (var i = 0; i < minDataLen; i++) {
        // 对数组的每个元素(即一句话)进行分词
        let result1 = nodejieba.tag(data1[i]);
        let result2 = nodejieba.tag(data2[i]);
        let minResLen = Math.min(result1.length);
        let maxResLen = Math.max(result2.length);
        for (var k = 0; k < minResLen; k++) {
          let res1 = result1[k];
          let res2 = result2[k];
          if (res1.tag == res2.tag) {
            all += paperpass.levenshteinDistance(res1.word, res2.word);
          }
        }
        for (let p = 0; p < maxResLen - minResLen; p++) {
          if (result1.length < result2.length) {
            all += result2[minResLen + p].word.length;
          } else {
            all += result1[minResLen + p].word.length;
          }
        }
      }
      for (let j = 1; j < maxDataLen - minDataLen + 1; j++) {
        if (data1.length < data2.length) {
          all += data2[minDataLen + j].length;
        } else {
          all += data1[minDataLen + j].length;
        }
      }
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
    it("should return 0 when the value is not present", function () {
      assert.equal([4, 2, 3, 1].indexOf(4), 0);
    });
  });
});
