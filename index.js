var request = require('request'),
    cheerio = require('cheerio'),
    fs = require("fs"),
    browserSync = require("browser-sync").create();

const sql = require("msnodesqlv8");
const connectionString = "Driver={SQL Server Native Client 11.0};Server=192.76.1.20,1433;Database=ERP4;Uid=ld;Pwd=ld;";
var arryData = [],
      pageNum = 1,
   maxPageNum = 4470;

var d="";


// Callback of the simplified HTTP request client
function reqCallback(err, response, body) {
    if (!err && response.statusCode == 200) {
        // 解析数据
        var $ = cheerio.load(body),
            $tr = $('.BOC_main tr'),
            $child = '', arryTmp = [],
            i = 1, len = $tr.length - 1;

        for (i; i < len; i++) {
            $child = $tr.eq(i).children();

            //arryTmp.push(Number($child.eq(1).text())/100) // 现汇买入
            //arryTmp.push(Number($child.eq(2).text())/100) // 现钞买入
            //arryTmp.push(Number($child.eq(3).text())/100) // 现汇卖出
            var time=$child.eq(6).text();
            var timearr = time.replace(" ", ":").replace(/\:/g, "-").split("-");
            var timestr = timearr[0].replace('.','-').replace('.','-');
            if(i==1){
                d=timestr;
            }
            if(i>1){
                if(d==timestr){
                    continue;
                }else{
                    d=timestr;
                }
            }
            var price=(Number($child.eq(5).text())/100).toFixed(2)
            arryTmp.push(price)//中行折算价
            arryTmp.push(timestr) // 发布时间

            arryData.push(arryTmp)

            arryTmp = []
        }


        fetchInfo()
    }
}


// 请求数据
function fetchInfo() {
    if (pageNum <= maxPageNum) {
        console.log('读取第'+ pageNum +'页数据...');
        request({
            url: 'http://srh.bankofchina.com/search/whpj/search.jsp',
            method: 'POST',
            form: {
                pjname: 1316,
                erectDate:'2017-01-01',
                nothing:'2018-12-04',
                page: pageNum++
            }
        }, reqCallback)
    } else {
        // 保存数据
        //arryData=arryData.delrepeat();
        var hash = {};  
        var result = [];  
        for(var i = 0, len = arryData.length; i < len; i++){  
            if(!hash[arryData[i]]){  
                result.push(arryData[i]);  
                hash[arryData[i]] = true;  
            }  
        }  
        //var data = fs.readFileSync('./app/data.json', 'utf8');
        // var jsonstr=JSON.stringify(result);
        // if(data.length>0){
        //     data=data.substr(0,data.length-1)+",";
        //     jsonstr=jsonstr.substr(1,jsonstr.length);
        //     jsonstr=data+jsonstr;
            
        // }
        for(var i=0,len =result.length; i<len;i++)
        {
            let sqlquery = "INSERT INTO 外销电商_爬虫数据USDCNY(publishdate,source,price,type) VALUES('" + result[i][1] + "','中国银行'," + result[i][0] + ",1)"
            sql.query(connectionString, sqlquery, (err, rows) => {
                console.log(rows);
                console.log(err);
            });
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
        browserSync.init({
            server: "./app",
            browser: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"
        });
        return
    }
}

console.log('开始抓取数据...');
fetchInfo();
