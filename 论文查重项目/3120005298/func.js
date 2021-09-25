module.exports = {
  //把文件内容转换成字符串函数
  string: function (file) {
    filechange = file
      .replace("\n", "")
      .replace(/(^\s+)|(\s+$)/g, "")
      .replace(/，/g, "")
      .replace(/；/g, "")
      .replace(/、/g, "")
      .replace(/\s/g, "");
    return filechange;
  },
  // 计算重复率
  calculate: function (num, f1, f2) {
    let chance = 0;
    chance = ((1 - num / Math.max(f1.length, f2.length)) * 100).toFixed(2);
    console.log(chance + "%");
    return chance;
  },
  // 通过编辑距离算法计算两个字符串的相似度，编辑距离函数
  levenshteinDistance: function (s, t) {
    if (s.length > t.length) {
      let temp = s;
      s = t;
      t = temp;
      delete temp;
    }
    let n = s.length;
    let m = t.length;
    if (m == 0) {
      return n;
    } else if (n == 0) {
      return m;
    }
    let v0 = [];
    for (let i = 0; i <= m; i++) {
      v0[i] = i;
    }
    let v1 = new Array(n + 1);
    let cost = 0;
    for (let i = 1; i <= n; i++) {
      if (i > 1) {
        v0 = v1.slice(0);
      }
      v1[0] = i;
      for (let j = 1; j <= m; j++) {
        if (s[i - 1].toLowerCase() == t[j - 1].toLowerCase()) {
          cost = 0;
        } else {
          cost = 1;
        }
        v1[j] = Math.min.call(null, v1[j - 1] + 1, v0[j] + 1, v0[j - 1] + cost);
      }
    }
    return v1.pop();
  },
};
