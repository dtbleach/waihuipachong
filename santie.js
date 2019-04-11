var superagent = require('superagent');
var events = require("events");
var cheerio = require('cheerio');
var async = require('async');
var request=require('request');
const sql = require("msnodesqlv8");

const connectionString = "Driver={SQL Server Native Client 11.0};Server=192.168.1.10,1433;Database=Crawler;Uid=sa;Pwd=sfiec_123;";
pa();



function pa() {
    var arr=[
        {
            "key":"GB5782",
            "one":"1554771034779",
            "jwt":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiZ3Vlc3QiLCJqdGkiOiI4OTM5MjA1OEZCOEY0RDM2QTU4OTVCQjY1N0NEMjJBRSIsInVzZXJuYW1lIjoiemhhbmd3dSJ9.OmC1xkd5n1DdXoQyd95i-Tjn_O4DQczpXlOFaeAwYH8"
        },
        {
            "key":"GB5783",
            "one":"1554943724175",
            "jwt":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiZ3Vlc3QiLCJqdGkiOiI4OTM5MjA1OEZCOEY0RDM2QTU4OTVCQjY1N0NEMjJBRSIsInVzZXJuYW1lIjoiemhhbmd3dSJ9.OmC1xkd5n1DdXoQyd95i-Tjn_O4DQczpXlOFaeAwYH8"
        },
        {
            "key":"GB70.1",
            "one":"1554948039773",
            "jwt":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiZ3Vlc3QiLCJqdGkiOiI4OTM5MjA1OEZCOEY0RDM2QTU4OTVCQjY1N0NEMjJBRSIsInVzZXJuYW1lIjoiemhhbmd3dSJ9.OmC1xkd5n1DdXoQyd95i-Tjn_O4DQczpXlOFaeAwYH8"
        },
        {
            "key": "GB70-76",
            "one": "1554948167946",
            "jwt":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiZ3Vlc3QiLCJqdGkiOiI4OTM5MjA1OEZCOEY0RDM2QTU4OTVCQjY1N0NEMjJBRSIsInVzZXJuYW1lIjoiemhhbmd3dSJ9.OmC1xkd5n1DdXoQyd95i-Tjn_O4DQczpXlOFaeAwYH8"
        },
        {
            "key": "%E7%89%B930%E5%9E%8B",
            "one": "1554948374891",
            "jwt":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiZ3Vlc3QiLCJqdGkiOiI4OTM5MjA1OEZCOEY0RDM2QTU4OTVCQjY1N0NEMjJBRSIsInVzZXJuYW1lIjoiemhhbmd3dSJ9.OmC1xkd5n1DdXoQyd95i-Tjn_O4DQczpXlOFaeAwYH8"
        }
    ]
    var arrdata=[];
    arr.forEach(function (o) {
        content(1,o.key,o.one,o.jwt);
    })

}


function content(page,key,one,jwt) {
    var url='http://api.santie.com/santie-restful/mainPage/getItem?' +
        '_=' +one+
        '&' +
        'sourceType=PC&' +
        'queryType=search&' +
        'keyword='+key+
        '&' +
        'level1Id=&level2Id=&' +
        'cz=&subType=1&' +
        'categoryId=&' +
        'districtid=2817&' +
        'serviceType=&' +
        'sellerType=&' +
        'condition=&' +
        'containzy=&' +
        'orderBy=&' +
        'pageindex='+page+'&' +
        'onlyqty=0&' +
        'standardid=&levelid=&' +
        'surfaceid=&' +
        'lengthid=&' +
        'materialid=&' +
        'toothdistanceid=&' +
        'toothformid=&' +
        'brandid=&' +
        'czid=&' +
        'diameterid=&' +
        'santieJwt='+jwt;
    var e = request({
        url: url,
        method: 'GET',
        headers: {'Content-Type': 'text/json'}
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data=JSON.parse(body).data;
            if(data!=undefined){
               var pageNum=data.pageNum;
               if(pageNum>0){
                   // var i=0;
                   //     for (i;i<pageNum;i++) {
                   //         arrdata.push(url.replace(/pageindex=1/g, 'pageindex=' + i));
                   //     };
                   // }
                   //var data=JSON.parse(pair).data;
                   var items=data.itemdata[0].storeList[0].items;
                   if(items!=undefined) {
                       var pageNum = data.pageNum;
                       items.forEach(function (item) {
                           var fenlei = item.standardname;
                           var tupian = item.imgurl;
                           var caizhi = item.materialname;
                           var pinming = item.standardcode;
                           var guige = item.spec;
                           var dengji = item.levelname;
                           var biaomian = item.surfacename;

                           var pinpai = item.brandname;
                           var cangku = item.storeName;
                           var kucun = item.qty;
                           var package = item.unitconversion2 + '千支/' + item.unitname2 + ' ' + item.unitconversion3 + '千支/' + item.unitname3;
                           var price = item.userprice;
                           var source = '三块神铁';
                           console.log(pinming + ' ' + pinpai + ' ' + caizhi + ' ' + guige + ' ' + dengji + ' ' + biaomian + ' ' + fenlei + ' ' + tupian + ' ' + cangku + ' ' + kucun + ' ' + price + ' ' + source);
                           let sqlquery = "INSERT INTO 外销电商_内销爬虫数据(材质,品名,规格,等级,表面处理,分类,图片,品牌,仓库,库存,包装信息,价格,数据来源) VALUES('" + caizhi + "','" + pinming + "','" + guige + "','" + dengji + "','" + biaomian + "','" + fenlei + "','" + img + "','" + pinpai + "','" + cangku + "','" + kucun + "','" + package + "','" + price + "','三块神铁')"
                           sql.query(connectionString, sqlquery, (err, rows) => {
                               //console.log(rows);
                               if(err!=null&&err!=undefined&&err!='undefined'){
                                   console.log(err);
                               }
                           });
                       })

                   }
               }

               if(pageNum>page){
                   content(page+1,key,one,jwt);
               }
            }

    };
})
}
//
// function urlzhua(arrydata) {
//     var concurrencyCount = 0;
//     var tmpData=[];
//     var fetch = function (url, callback) {
//         if(tmpData.indexOf(url)==-1){
//             tmpData.push(url);
//             console.time('  耗时');
//             concurrencyCount++;
//             superagent.get(url).end( function (err, res) {
//                 console.log('并发数:', concurrencyCount--, 'fetch', url);
//                 //var $ = cheerio.load(res.text);
//                 callback(null, [url, res.text]);
//             });
//         }else{
//             console.log("重复的url: "+url);
//         }
//
//     }
//     async.mapLimit(arrydata, 1, function (url, callback) {
//         fetch(url, callback);
//         console.timeEnd("  耗时");
//     }, function (err, result) {
//         result = result.map( function (pair) {
//             console.log(pair);
//             // var data=JSON.parse(pair).data;
//             // var items=data.itemdata[0].storeList[0].items;
//             // if(items!=undefined) {
//             //     var pageNum = data.pageNum;
//             //     items.forEach(function (item) {
//             //         var fenlei = item.standardname;
//             //         var tupian = item.imgurl;
//             //         var caizhi = item.materialname;
//             //         var pinming = item.standardcode;
//             //         var guige = item.spec;
//             //         var dengji = item.levelname;
//             //         var biaomian = item.surfacename;
//             //
//             //         var pinpai = item.brandname;
//             //         var cangku = item.storeName;
//             //         var kucun = item.qty;
//             //         var package = item.unitconversion2 + '千支/' + item.unitname2 + ' ' + item.unitconversion3 + '千支/' + item.unitname3;
//             //         var price = item.userprice;
//             //         var source = '三块神铁';
//             //         console.log(pinming + ' ' + pinpai + ' ' + caizhi + ' ' + guige + ' ' + dengji + ' ' + biaomian + ' ' + fenlei + ' ' + tupian + ' ' + cangku + ' ' + kucun + ' ' + price + ' ' + source);
//             //     })
//             //
//             // }
//         });
//         console.log('final:\n',result);
//     });
// }

