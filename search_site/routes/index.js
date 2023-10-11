var express = require('express');
var router = express.Router();
var mysql = require('../mysql.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/process_get', function(request, response){
  var title = request.query.title;
  var keywords = request.query.keywords;
  var content = request.query.content;
  var orderBy = request.query.orderBy;
  // SQL 查询语句，按指定字段排序
  var fetchSql = "SELECT url, source_name, title, keywords, author, publish_date " +
                "FROM fetches " +
                "WHERE 1=1"; // 使用 1=1 作为基础条件，后续根据查询指标动态拼接条件

    // 根据传递的查询指标动态拼接 SQL 查询语句的条件
    if (title) {
    fetchSql += " AND title LIKE '%" + title + "%'";
    }
    if (keywords) {
    fetchSql += " AND keywords LIKE '%" + keywords + "%'";
    }
    if (content) {
    fetchSql += " AND content LIKE '%" + content + "%'";
    }
    fetchSql += " ORDER BY " + orderBy;

  mysql.query(fetchSql, function(err, result, fields){
      response.writeHead(200, {
          "Content-Type": "application/json"
      });
      response.write(JSON.stringify(result));
      response.end();
  });
});

router.get('/keywords', function(req, res) {
  var fetchSql = "SELECT keywords FROM fetches"; // 查询数据库中的 keywords 属性
  mysql.query(fetchSql, function(err, result, fields) {
      if (err) {
          console.log(err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }

      // 处理查询结果，构建关键词数据数组
      var keywordsData = {};
      for (var i = 0; i < result.length; i++) {
          var keywords = result[i].keywords;
          var keywordList = keywords.split(',');
          for (var j = 0; j < keywordList.length; j++) {
              var keyword = keywordList[j].trim();
              if (keyword in keywordsData) {
                  keywordsData[keyword]++;
              } else {
                  keywordsData[keyword] = 1;
              }
          }
      }

      // 转换为数组形式
      var keywordArray = [];
      for (var keyword in keywordsData) {
          var keywordObj = {
              name: keyword,
              value: keywordsData[keyword]
          };
          keywordArray.push(keywordObj);
      }

      // 将关键词数据数组传递给前端
      res.json(keywordArray);
      console.log(keywordArray);
  });
});

// GET keyword_frequency
router.get('/keyword_frequency', function(req, res) {
    var keyword = req.query.keyword; // 获取输入的特定关键词属性
  
    var fetchSql = "SELECT publish_date, COUNT(*) as frequency FROM fetches WHERE keywords LIKE '%" + keyword + "%' GROUP BY publish_date"; // 查询数据库中特定关键词属性的当天出现频数数据
    mysql.query(fetchSql, function(err, result, fields) {
      if (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
  
      // 处理查询结果，构建折线图数据数组
      var lineChartData = result.map(item => ({
        date: item.publish_date,
        frequency: item.frequency
      }));
  
      // 将折线图数据数组传递给前端
      res.json(lineChartData);
      console.log(lineChartData);
    });
  });
  

module.exports = router;