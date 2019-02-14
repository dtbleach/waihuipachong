var superagent = require('superagent');
var events = require("events");
var cheerio = require('cheerio');


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



function login() {
    superagent.post(login_url)
        .set(base_header)
        .type('form')
        .send('Mobile=13801925705&Password=KnMSYglLt16YdptUzJflePcxkKHmMK%2Fzr%2FC19rAAQ9eRSPjLGFx7dZUa55t9%252Bk8p4%252B6JbKDCYDvEQs%2F2UrNFUMJ3BglSFBEQVZHL6BBRys0ep%2FtwNche0rIo2uVvnNBbKrU63EG8UCFEU780Zndcle0WhWE%2FmPjoTiqfAtoeEeQ%3D')
        .end(function (err,res) {
            console.log(res);
            if(err) throw err;
            var cookie = res.header['set-cookie']
            emitter.emit("setCookeie", cookie)
        })
}

function getContent (cookie) {
    console.log(cookie);
    superagent.get("https://www.51hgp.com/RegionGoods/Goods?Category_Top_ID=1&Category_Sec_ID=2&Standard_ID=2&TenantID=3741&RID=7")             //随便论坛里的一个地址
        .set("Cookie", cookie)                 //在resquest中设置得到的cookie，只设置第四个足以（具体情况具体分析）
        .end(function(err, sres){
            if (err){
                throw err;
            };
            var $ = cheerio.load(sres.text),
            $tb=$('.product-list-head').next(),
            $tr=$tb.children(),
            i = 1,len = $tr.length - 1,$child = '';
            for (i; i < len; i++) {
                $child = $tr.eq(i).children();

                console.log($child.eq(10).find('.goodsPrice').attr('data-price'));
            }

        })
};
