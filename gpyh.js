var superagent = require('superagent');
var events = require("events");
var cheerio = require('cheerio');
const sql = require("msnodesqlv8");
const connectionString = "Driver={SQL Server Native Client 11.0};Server=192.76.1.20,1433;Database=ERP4;Uid=ld;Pwd=ld;";

var arryData = [],
    pageNum = 1,
    maxPageNum = 70;

const base_header={
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


const login_url='https://www.gpyh.com/passport/login'



var emitter = new events.EventEmitter()

login()
emitter.on("setCookeie", getContent)



function login() {
    var area='';
    superagent.post("https://www.gpyh.com/area/setAreaToCookid?provinceId=861&cityId=3524&provinceName=%E4%B8%8A%E6%B5%B7%E5%B8%82&cityName=%E4%B8%8A%E6%B5%B7%E5%B8%82")             //随便论坛里的一个地址
        .set(base_header)                 //在resquest中设置得到的cookie，只设置第四个足以（具体情况具体分析）
        .end(function(err, sres){
            // console.log(sres);
            if (err){
                throw err;
            }
            var cookie = sres.header['set-cookie'];
            //console.log(cookie);
            area=cookie[0];
            //console.log(area);
            superagent.post(login_url)
                .set(base_header)
                .type('form')
                .send('username=13801925705&password=a123456&isRemember=')
                .end(function (err,res) {
                    //console.log(res);
                    if(err) throw err;
                    var cookie = res.header['set-cookie'];
                    //console.log(cookie);
                    cookie.push(area);
                    //console.log(cookie);
                    emitter.emit("setCookeie", cookie);
                })
        })
}

function getContent (cookie) {
    //console.log(cookie);
    for(p=pageNum;p<=maxPageNum;p++) {
        console.log(p);
        var url1="https://www.gpyh.com/quickbuy/goodsSearchPage?pageNum="+p+
            "&searchKey=5783&hasStock=&isSelfSell=&isNew=&barCode=&categoryJson=&materialJson=&goodsNameJson=&surfaceJson=&brandJson=&merchantJson=&diameterJson=&lengthJson=&gradeJson=&goodsStandardId=&finalCategoryId=&categoryId=&toolCategoryId=";
        var url2="https://www.gpyh.com/quickbuy/goodsSearchPage?pageNum="+p+
            "&searchKey=5782&hasStock=&isSelfSell=&isNew=&barCode=&categoryJson=&materialJson=&goodsNameJson=&surfaceJson=&brandJson=&merchantJson=&diameterJson=&lengthJson=&gradeJson=&goodsStandardId=&finalCategoryId=&categoryId=&toolCategoryId=";
        superagent.get(url2)             //随便论坛里的一个地址
            .set("Cookie", cookie)                 //在resquest中设置得到的cookie，只设置第四个足以（具体情况具体分析）
            .end(function (err, sres) {
                // console.log(sres);
                if (err) {
                    throw err;
                }
                //console.log(sres.text);
                var $ = cheerio.load(sres.text),
                    $tr = $('.goods-table-body tr'),
                    i = 1, len = $tr.length-1 , $child = '';

                for (i; i <= len; i++) {
                    var img=$tr.eq(i).children().eq(0).find('img').attr('src').substr(2)
                    var title=$tr.eq(i).children().eq(0).find('.goods-txt-name').find('a').attr('title');
                    title=title.replace(/\s+/g, ' ').split(' ');
                    var pinpai=$tr.eq(i).children().eq(2).text().trim();
                    var cangku=$tr.eq(i).children().eq(3).text().trim();
                    var package=$tr.eq(i).children().eq(4).find('.pkg-info').text().trim();
                    var kucun=$tr.eq(i).children().eq(5).children().text().trim();
                    var price=$tr.eq(i).children().eq(7).find('span[id^=sale_price]').attr('dir').trim();
                    let sqlquery = "INSERT INTO 外销电商_内销爬虫数据(材质,品名,规格,表面处理,分类,图片,品牌,仓库,库存,包装信息,价格,数据来源) VALUES('" + title[0] + "','"+title[1]+"','"+title[2]+"','"+title[3]+"','"+title[4]+"','"+img+"','"+pinpai+"','"+cangku+"','"+kucun+"','"+package+"','"+price+"','工品一号')"
                    sql.query(connectionString, sqlquery, (err, rows) => {
                        console.log(rows);
                        console.log(err);
                    });
                }

            })
    }
};
