var request = require('request'),
    cheerio = require('cheerio'),
    fs = require("fs"),
    browserSync = require("browser-sync").create();
var iconv = require('iconv-lite');
const sql = require("msnodesqlv8");
const connectionString = "Driver={SQL Server Native Client 11.0};Server=127.0.0.1,1433;Database=t66y;Uid=sa;Pwd=leon1986;";
var arryData = [],
    pageNum = 41,
    maxPageNum = 45;

var d="";


// Callback of the simplified HTTP request client
function reqCallback(err, response, body) {
    if (!err && response.statusCode == 200) {
        // 解析数据
        var buf = iconv.decode(body, 'gb2312').toString(); //解码gb2312
        var $ = cheerio.load(buf),
            $tr = $('.tpc_content'),
            $child = '', arryTmp = [],
            i = 1, len = $tr.length - 1;
        for (i; i < len; i++) {
            var context = $tr.eq(i).find('a').text();
            if(context!=''&&context.indexOf('magnet:?xt=')!=-1) {
                arryTmp.push(context)
                arryData.push(arryTmp)
            }
            arryTmp = []
        }


        fetchInfo()
    }
}


// 请求数据
function fetchInfo() {
    if (pageNum <= maxPageNum) {
        console.log('读取第'+ pageNum +'页数据...');
        request(
            {
                url:'https://cc.xdyz.icu/read.php?tid=3425262&fpage=0&toread=&page='+pageNum,
                encoding:null
            },
            reqCallback)
        pageNum++
    } else {
        // 保存数据
        var hash = {};
        var result = [];
        for(var i = 0, len = arryData.length; i < len; i++){
            if(!hash[arryData[i]]){
                result.push(arryData[i]);
                hash[arryData[i]] = true;
            }
        }
        for(var i=0,len =result.length; i<len;i++)
        {
            let sqlquery = "INSERT INTO qiuzhu(url,date) VALUES('"+result[i]+"','2019年2月')"
            sql.query(connectionString, sqlquery, (err, rows) => {
                console.log(result[i]);
           });
            console.log(result[i]);
        }
        // fs.appendFile('./app/data.json', jsonstr, function (err) {
        //     if (err) throw err;
        //     console.log('追加内容完成');
        //   });
        //fs.writeFile('./app/data.json', jsonstr, function(err) {
        //if (err) throw err;
        //console.log('数据保存成功');
        //})
        // 前台展示数据

        return
    }
}

console.log('开始抓取数据...');
fetchInfo();
