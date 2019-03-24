//<meta charset="utf-8"/>

var request = require('request'),
    cheerio = require('cheerio'),
    superagent = require('superagent')
require('superagent-charset')(superagent),
    express = require('express'),
    fs = require("fs"),
    browserSync = require("browser-sync").create();
var iconv = require('iconv-lite');
const sql = require("msnodesqlv8");
const connectionString = "Driver={SQL Server Native Client 11.0};Server=127.0.0.1,1433;Database=t66y;Uid=sa;Pwd=leon1986;";
var arryData = [],
    pageNum = 1,
    maxPageNum = 3;

var d="";


// Callback of the simplified HTTP request client
function reqCallback(err, response, body) {
    if (!err && response.statusCode == 200) {
        // 解析数据
        var buf = iconv.decode(body, 'gb2312').toString(); //解码gb2312
        var $ = cheerio.load(buf),
            $tr = $('#ajaxtable').children().eq(1).children(),
            $child = '', arryTmp = [],urlTmp=[],
            i = 0, len = $tr.length;
        for (i; i < len; i++) {
            var context = $tr.eq(i).find('a').attr('href');
            if(context!=undefined&&context.indexOf('html_data')>=0) {
                context = "http://1024.clsmik.pw/pw/" + context;
                urlTmp.push(context);
                console.log(context);
            }
            // if(context!=''&&context.indexOf('magnet:?xt=')!=-1) {
            //     arryTmp.push(context)
            //     arryData.push(arryTmp)
            // }
            // arryTmp = []
        }

        for(var k=0,len=urlTmp.length;k<len;k++){
            request(
                {
                    url:urlTmp[k],
                    encoding:null
                },
                get2url)
        }

    }
}

function get2url(err, response, body) {
    if (!err && response.statusCode == 200) {
        var urlTmp=[];
        var buf = iconv.decode(body, 'gb2312').toString(); //解码gb2312
        var $ = cheerio.load(buf),
            $tr = $('#read_tpc');
        var url2=$tr.find('a').attr('href');
        if(url2.indexOf('www1.downsx')>=0){
            urlTmp.push(url2);
            console.log(url2);
        }

        for(var i=0,len=urlTmp.length;i<len;i++){

            // superagent.get(urlTmp[i])
            //     .charset('utf8')
            //     .end(function (err, sres) {
            //         var html = sres.text;
            //         var $ = cheerio.load(html, {decodeEntities: false});
            //         $tr = $('.dlboxbg').children().eq(0);
            //         var str=$tr.attr('href')
            //         console.log(str.replace(/&amp;/g,'&'));
            //     });


            request(
                {
                    url:urlTmp[i],
                    encoding:null
                },
                get3url)
        }
    }
}

function get3url(err, response, body){
    if (!err && response.statusCode == 200) {
        var buf = iconv.decode(body, 'utf8').toString(); //解码gb2312
        var $ = cheerio.load(buf),
            $tr = $('.dlboxbg').children().eq(0);
        var str=$tr.attr('href'), arryTmp = []
        let sqlquery = "INSERT INTO qiuzhu(url,date,type) VALUES('"+str+"','1月','1024xp')"
        sql.query(connectionString, sqlquery, (err, rows) => {
            console.log(err);
        });
        console.log(str);
    }
}


// 请求数据
function fetchInfo() {
    // for (var i = 1; i <= 3; i++) {
    var i=3;
    console.log('读取第' + i + '页数据...');
    request(
        {
            url: 'http://1024.clsmik.pw/pw/thread-htm-fid-110-page-' + i + '.html',
            encoding: null
        },
        reqCallback)

}

console.log('开始抓取数据...');
fetchInfo();
console.log('结束...');
