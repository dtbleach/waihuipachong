var request = require('request'),
    cheerio = require('cheerio'),
    fs = require("fs"),
    browserSync = require("browser-sync").create();

const sql = require("msnodesqlv8");
const connectionString = "Driver={SQL Server Native Client 11.0};Server=192.76.1.20,1433;Database=ERP4;Uid=ld;Pwd=ld;";
var arryData = [],
    pageNum = 1,
    maxPageNum = 4470;

/**
 * 扩展Date的Format函数
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * @param {[type]} fmt [description]
 */
Date.prototype.Format = function(fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 * [getYestoday 获得昨天的格式化日期]
 * @return {[type]} [description]
 */
function getYestoday() {
    return new Date(new Date().getTime() - 1000 * 60 * 60 * 24).Format("yyyy-MM-dd")
}

/**
 * [getToday 获得今天的格式化日期]
 * @return {[type]} [description]
 */
function getToday() {
    return new Date().Format("yyyy-MM-dd")
}

/**
 * [getTomorrow 获得明天的格式化日期]
 * @return {[type]} [description]
 */
function getTomorrow() {
    return new Date(new Date().getTime() + 1000 * 60 * 60 * 24).Format("yyyy-MM-dd")
}


// Callback of the simplified HTTP request client
function reqCallback(err, response, body) {
    if (!err && response.statusCode == 200) {
        // 解析数据
        var $ = cheerio.load(body),
            $tr = $('.BOC_main tr'),
            $child = '', arryTmp = [],
            i = 1, len = $tr.length - 1;

        $child = $tr.eq(1).children();

        //arryTmp.push(Number($child.eq(1).text())/100) // 现汇买入
        //arryTmp.push(Number($child.eq(2).text())/100) // 现钞买入
        //arryTmp.push(Number($child.eq(3).text())/100) // 现汇卖出
        var time=$child.eq(6).text();
        var timearr = time.replace(" ", ":").replace(/\:/g, "-").split("-");
        var timestr = timearr[0].replace('.','-').replace('.','-');

        var price=(Number($child.eq(5).text())/100).toFixed(2)
        let sqlquery = "INSERT INTO 外销电商_爬虫数据USDCNY(publishdate,source,price,type) VALUES('" + timestr + "','中国银行'," + price + ",1)"
        sql.query(connectionString, sqlquery, (err, rows) => {
            console.log(rows);
            console.log(err);
        });
    }
}


// 请求数据
function fetchInfo() {
    var yestoday= getYestoday();
    console.log('开始抓取昨天数据...');
    request({
        url: 'http://srh.bankofchina.com/search/whpj/search.jsp',
        method: 'POST',
        form: {
            pjname: 1316,
            erectDate:yestoday,
            nothing:yestoday,
            page: 1
        }
    }, reqCallback)

    console.log('抓取完成...');

    return
    
}

console.log('开始抓取数据...');
fetchInfo();
