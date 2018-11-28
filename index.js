var request = require('request'),
    cheerio = require('cheerio'),
    fs = require("fs"),
    browserSync = require("browser-sync").create();

var arryData = [],
      pageNum = 1,
   maxPageNum = 13;

var d="";

Array.prototype.delrepeat = function(){  
    //将数组进行排序  
    this.sort();  
    //定义结果数组  
    var arr=[];  
    for(var i = 1; i < this.length; i++){    //从数组第二项开始循环遍历数组  
        //判断相邻两个元素是否相等，如果相等说明数据重复，否则将元素写入结果数组  
        if(this[i] !== arr[arr.length - 1]){  
            arr.push(this[i]);  
        }              
    }  
    return arr;  
      
}

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
           
            arryTmp.push((Number($child.eq(5).text())/100).toFixed(2))//中行折算价
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
                erectDate:'2018-11-26',
                nothing:'2018-11-27',
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
        fs.writeFile('./app/data.json', JSON.stringify(result), function(err) {
            if (err) throw err;
            console.log('数据保存成功');
        })
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
