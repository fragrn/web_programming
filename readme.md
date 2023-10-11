# functions of this website:

## search engine for the news I crawled from https://news.163.com/
![](/Images/website_show1.png)\
![](/Images/show2.png)
## visualize the popularity of a certain keyword
![](/Images/show3.png)\
## popular words visualization
![](/Images/show4.png)
### ducument notes:
crawler里的webcrawler是爬虫代码，运行它可以爬取网易的新闻\
mysql.js里定义了对数据库进行操作的函数，来供其它代码文件使用\
search_site是express安装的脚手架，后端代码在routes/index.js中：\
'/process_get'：处理/process_get路径的GET请求，从数据库中获取数据并返回JSON响应。\
'/keywords'：处理/keywords路径的GET请求，从数据库中获取关键词数据并返回JSON响应。\
'/keyword_frequency'：处理/keyword_frequency路径的GET请求，根据特定关键词属性查询数据库并返回折线图数据。\

前端查询页面是public/search.html，通过search.html可以跳转到词云图页面wordcloud.html和关键词热度折线图页面linechart.html
