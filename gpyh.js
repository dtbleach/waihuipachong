var superagent = require('superagent');
var events = require("events");
var cheerio = require('cheerio');
var async = require('async')
const sql = require("msnodesqlv8");

//const connectionString = "Driver={SQL Server Native Client 11.0};Server=192.168.1.10,1433;Database=Crawler;Uid=sa;Pwd=sfiec_123;";
const connectionString = "Driver={SQL Server Native Client 11.0};Server=.,1433;Database=Crawler;Uid=sa;Pwd=leon1986;";



class Ut {
    /**
     * 异步延迟
     * @param {number} time 延迟的时间,单位毫秒
     */
    static sleep(time = 0) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, time);
        })
    };
}

const base_header = {
    Host: 'www.gpyh.com',
    Connection: 'keep-alive',
    Accept: 'application/json, text/javascript, */*; q=0.01',
    Origin: 'https://www.gpyh.com',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Referer: 'https://www.gpyh.com/passport/login',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7'
}


const login_url = 'https://www.gpyh.com/passport/login'


var emitter = new events.EventEmitter()

login()
emitter.on("setCookeie", getContent)
emitter.on("goto", urlzhua)


function login() {
    var area = '';
    superagent.post("https://www.gpyh.com/area/setAreaToCookid?provinceId=861&cityId=3524&provinceName=%E4%B8%8A%E6%B5%B7%E5%B8%82&cityName=%E4%B8%8A%E6%B5%B7%E5%B8%82")             //随便论坛里的一个地址
        .set(base_header)                 //在resquest中设置得到的cookie，只设置第四个足以（具体情况具体分析）
        .end(function (err, sres) {
            // console.log(sres);
            if (err) {
                throw err;
            }
            var cookie = sres.header['set-cookie'];
            for (u = 0; u < cookie.length; u++) {
                //console.log(cookie[u]);
                if (cookie[u].indexOf("GPYH_AREA") != -1) {
                    area = cookie[u];
                    console.log(cookie[u])
                }
            }
            superagent.post(login_url)
                .set(base_header)
                .type('form')
                .send('username=13801925705&password=a123456&isRemember=')
                .end(function (err, res) {
                    //console.log(res);
                    if (err) throw err;
                    var cookie = res.header['set-cookie'];
                    //console.log(cookie);
                    // console.log((area))
                    cookie.push(area);
                    console.log(cookie);
                    emitter.emit("setCookeie", cookie);
                })
        })
}

function getContent(cookie) {
    //console.log(cookie);
    var pin1 = 'GB5783';
    var pin2 = 'GB5782';
    var pin3 = 'GB70.1';
    var pin4 = 'GB70-76';
    var pin5 = '%e7%89%b930';
    var str = [pin1, pin2, pin3, pin4, pin5];


    var obj = [];
    str.forEach(function (ck) {
        var urlpage = "https://www.gpyh.com/quickbuy/goodsSearchPage?pageNum=1&searchKey=" + ck + "&hasStock=&isSelfSell=&isNew=&barCode=&categoryJson=&materialJson=&goodsNameJson=&surfaceJson=&brandJson=&merchantJson=&diameterJson=&lengthJson=&gradeJson=&goodsStandardId=&finalCategoryId=&categoryId=&toolCategoryId=";
        superagent.get(urlpage)
            .set("Cookie", cookie) //在resquest中设置得到的cookie，只设置第四个足以（具体情况具体分析）
            .end(function (err, sres) {

                if (err) {
                    console.log(err)
                    throw err;
                }
                var $ = cheerio.load(sres.text),
                    $page = $('.total');
                //console.log($.html());
                var page = $page.html();

                page = page.replace('&#x5171;', '');
                page = page.replace('&#x9875;', '');
                page = Number(page);
                var mod = {
                    'key': ck,
                    'value': page

                }

                console.log(mod.value);
                var arryData=[];
                zhua(mod.value, mod.key, arryData);

                emitter.emit("goto", cookie,arryData);
            })
    })
};

function zhua(page, str,arryData) {
    for (p = 1; p <= page; p++) {
        var urlpage = "https://www.gpyh.com/quickbuy/goodsSearchPage?pageNum=" + p + "&searchKey=" + str + "&hasStock=&isSelfSell=&isNew=&barCode=&categoryJson=&materialJson=&goodsNameJson=&surfaceJson=&brandJson=&merchantJson=&diameterJson=&lengthJson=&gradeJson=&goodsStandardId=&finalCategoryId=&categoryId=&toolCategoryId=";
        arryData.push(urlpage);
    }
}

function urlzhua(cookie,arryData) {
    var concurrencyCount = 0;
    var fetch = function (url, callback) {
        console.time('  耗时');
        concurrencyCount++;
        superagent.get(url).set("Cookie", cookie).end( function (err, res) {
            console.log('并发数:', concurrencyCount--, 'fetch', url);
            //var $ = cheerio.load(res.text);
            callback(null, [url, res.text]);
        });

    }
    async.mapLimit(arryData, 11, function (url, callback) {
        fetch(url, callback);
        console.timeEnd("  耗时");
    }, function (err, result) {
        result = result.map( function (pair) {
            var $ = cheerio.load(pair[1]);
            var $tr = $('.goods-table-body tr'),
                i = 1, len = $tr.length - 1, $child = '';
            for (i; i <= len; i++) {
                try {

                    if ($tr.eq(i).attr('class') == 'section-item') {


                        var img = '' + $tr.eq(i).children().eq(0).find('img').attr('src');

                        if (img != 'undefined') {
                            if (img != '/static/dist/img/zwtp1.jpg')
                                img = img.substr(2);
                            else
                                img = 'www.gpyh.com' + img;

                        }
                        var title = $tr.eq(i).children().eq(0).find('.goods-txt-name').find('a').attr('title');
                        title = title.replace(/\s+/g, ' ').split(' ');
                        var pinpai = $tr.eq(i).children().eq(2).text().trim();
                        var cangku = $tr.eq(i).children().eq(3).text().trim();
                        var package = $tr.eq(i).children().eq(4).find('.pkg-info').text().trim();
                        var kucun = $tr.eq(i).children().eq(5).children().text().trim();
                        var price = $tr.eq(i).children().eq(7).find('span[id^=sale_price]').attr('dir').trim();

                        var caizhi = title[0];
                        var pinming = title[1];
                        var guige = title[2];
                        var dengji = '';
                        var biaomian = '';
                        var fenlei = '';
                        if (title.length == 6) {
                            dengji = title[3];
                            biaomian = title[4];
                            fenlei = title[5];
                        }
                        if (title.length == 5) {
                            biaomian = title[3];
                            fenlei = title[4];
                        }
                        if(price!=undefined&&price!='undefined') {
                            console.log(price);
                            let sqlquery = "INSERT INTO 外销电商_内销爬虫数据(材质,品名,规格,等级,表面处理,分类,图片,品牌,仓库,库存,包装信息,价格,数据来源) VALUES('" + caizhi + "','" + pinming + "','" + guige + "','" + dengji + "','" + biaomian + "','" + fenlei + "','" + img + "','" + pinpai + "','" + cangku + "','" + kucun + "','" + package + "','" + price + "','工品一号')"
                            sql.query(connectionString, sqlquery, (err, rows) => {
                                //console.log(rows);
                                if(err!=null&&err!=undefined&&err!='undefined'){
                                    console.log(err);
                                }
                            });
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        });
        console.log('final:\n',result);
    });
}

