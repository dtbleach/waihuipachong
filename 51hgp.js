var superagent = require('superagent');
var events = require("events");
var cheerio = require('cheerio');
var async = require('async');
const sql = require("msnodesqlv8");

const connectionString = "Driver={SQL Server Native Client 11.0};Server=192.168.1.10,1433;Database=Crawler;Uid=sa;Pwd=sfiec_123;";
const base_header={
    Host: 'www.51hgp.com',
    Connection: 'keep-alive',
    Accept: 'application/json, text/javascript, */*; q=0.01',
    Origin: 'https://www.51hgp.com',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Referer: 'https://www.51hgp.com/Authority/Login?ReturnUrl=/',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7'
}

const login_url='http://www.51hgp.com/Login/Index'



var emitter = new events.EventEmitter()

login()
emitter.on("setCookeie", getContent)
emitter.on("goto", urlzhua)


function login() {
    superagent.post(login_url)
        .set(base_header)
        .type('form')
        .send('Mobile=13801925705&Password=KnMSYglLt16YdptUzJflePcxkKHmMK%2Fzr%2FC19rAAQ9eRSPjLGFx7dZUa55t9%252Bk8p4%252B6JbKDCYDvEQs%2F2UrNFUMJ3BglSFBEQVZHL6BBRys0ep%2FtwNche0rIo2uVvnNBbKrU63EG8UCFEU780Zndcle0WhWE%2FmPjoTiqfAtoeEeQ%3D')
        .end(function (err,res) {
            //console.log(res);
            if(err) throw err;
            var cookie = res.header['set-cookie']
            emitter.emit("setCookeie", cookie)
        })
}

function getContent (cookie) {
    var pin1 = 'GB5783';
    var pin2 = 'GB5782';
    var pin3 = 'GB70.1';
    var pin4 = 'GB70-76';
    var pin5 = '%e7%89%b930';
    var str = [pin1, pin2, pin3, pin4, pin5];
    str.forEach(function (ck) {
        var urlpage ="https://www.51hgp.com/Search?page=1&DirectSell=False&NamedBrand=False&Keyword="+ck+"&TenantID=3741#good-style";

        superagent.get(urlpage)
            .set("Cookie", cookie) //在resquest中设置得到的cookie，只设置第四个足以（具体情况具体分析）
            .end(function (err, sres) {

                if (err) {
                    console.log(err)
                    throw err;
                }
                var $ = cheerio.load(sres.text),
                    $page = $('.page-tab').find('span');
                //console.log($.html());
                var page = $page.children().eq(0).text();
                //console.log(page);

                page = Number(page);
                var mod = {
                    'key': ck,
                    'value': page

                }

                //console.log(mod.value);
                var arryData=[];

                zhua(mod.value, mod.key, arryData);

                emitter.emit("goto", cookie,arryData);
                //  arryData.forEach(function (dd){
                //      console.log(dd)
                //  })
            })
            //
            // superagent.get("https://www.51hgp.com/Search?page=11&DirectSell=False&NamedBrand=False&Keyword=GB70.1&TenantID=3741#good-style")             //随便论坛里的一个地址
            // .set("Cookie", cookie)                 //在resquest中设置得到的cookie，只设置第四个足以（具体情况具体分析）
            // .end(function(err, sres){
            //     if (err){
            //         throw err;
            //     };
            //     var $ = cheerio.load(sres.text);
            //     var $head=$("[class='tab-head-type bgf9']");
            //     var j=0;
            //     for(j;j<$head.length;j++){
            //         var $bod=$('.product-list-head');
            //         var $tb=$bod.eq(j).next(),
            //             $tr=$tb.children(),
            //             i = 0,len = $tr.length,$child = '';
            //         var fenlei =$head.eq(j).find('h2').text();
            //         var tupian =$head.eq(j).find('img').attr('src');
            //         console.log(fenlei);
            //         for (i; i < len; i++) {
            //             $child = $tr.eq(i).children();
            //             var caizhi =$child.eq(4).text();
            //             var pinpai ='GB5782';
            //             var guige=$child.eq(2).text();
            //             var dengji=$child.eq(1).text();
            //             var biaomian=$child.eq(3).text();
            //
            //             var pinpai=$child.eq(6).text();
            //             var cangku=$child.eq(9).children().eq(0).text();
            //             var kucun=$child.eq(7).children().eq(0).text();
            //             var package='';
            //             var price=$child.eq(10).find('.goodsPrice').attr('data-price');
            //             var source='好工品';
            //             console.log(pinpai+' '+caizhi+' '+guige+' '+dengji+' '+biaomian+' '+fenlei+' '+tupian+' '+cangku+' '+kucun+' '+price+' '+source);
            //         }
            //     }
            //
            //
            // })
    })

}


function zhua(page, str,arryData) {
    for (p = 1; p <= page; p++) {
        var urlpage = "https://www.51hgp.com/Search?page="+p+"&DirectSell=False&NamedBrand=False&Keyword="+str+"&TenantID=3741#good-style";
        arryData.push(urlpage);
    }
}

function urlzhua(cookie,arryData) {
    var concurrencyCount = 0;
    var tmpData=[];
    var fetch = function (url, callback) {
        if(tmpData.indexOf(url)==-1){
            tmpData.push(url);
            console.time('  耗时');
            concurrencyCount++;
            superagent.get(url).set("Cookie", cookie).end( function (err, res) {
                console.log('并发数:', concurrencyCount--, 'fetch', url);
                //var $ = cheerio.load(res.text);
                callback(null, [url, res.text]);
            });
        }else{
            console.log("重复的url: "+url);
        }

    }
    async.mapLimit(arryData, 1, function (url, callback) {
        fetch(url, callback);
        console.timeEnd("  耗时");
    }, function (err, result) {
        result = result.map( function (pair) {
                var $ = cheerio.load(pair[1]);
                var $head=$("[class='tab-head-type bgf9']");
                var j=0;
                for(j;j<$head.length;j++){
                    var $bod=$('.product-list-head');
                    var $tb=$bod.eq(j).next(),
                        $tr=$tb.children(),
                        i = 0,len = $tr.length,$child = '';
                    var fenlei =$head.eq(j).find('h2').text();
                    var tupian =$head.eq(j).find('img').attr('src');
                    console.log(fenlei);
                    for (i; i < len; i++) {
                        $child = $tr.eq(i).children();
                        var caizhi =$child.eq(4).text();
                        var pinming ='GB5782';
                        var guige=$child.eq(2).text();
                        var dengji=$child.eq(1).text();
                        var biaomian=$child.eq(3).text();

                        var pinpai=$child.eq(6).text();
                        var cangku=$child.eq(9).children().eq(0).text();
                        var kucun=$child.eq(7).children().eq(0).text();
                        var package='';
                        var price=$child.eq(10).find('.goodsPrice').attr('data-price');
                        var source='好工品';
                        console.log(pinpai+' '+caizhi+' '+guige+' '+dengji+' '+biaomian+' '+fenlei+' '+tupian+' '+cangku+' '+kucun+' '+price+' '+source);
                        let sqlquery = "INSERT INTO 外销电商_内销爬虫数据(材质,品名,规格,等级,表面处理,分类,图片,品牌,仓库,库存,包装信息,价格,数据来源) VALUES('" + caizhi + "','" + pinming + "','" + guige + "','" + dengji + "','" + biaomian + "','" + fenlei + "','" + img + "','" + pinpai + "','" + cangku + "','" + kucun + "','" + package + "','" + price + "','好工品')"
                        sql.query(connectionString, sqlquery, (err, rows) => {
                            //console.log(rows);
                            if(err!=null&&err!=undefined&&err!='undefined'){
                                console.log(err);
                            }
                        });
                    }
                }
        });
        console.log('final:\n',result);
    });
}
