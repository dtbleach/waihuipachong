const sql = require("msnodesqlv8");

const connectionString = "Driver={SQL Server Native Client 11.0};Server=192.168.1.10,1433;Database=Crawler;Uid=sa;Pwd=sfiec_123;";

del();
function del() {
    let sqlquery = "DELETE FROM  [Crawler].[dbo].[外销电商_内销爬虫数据] WHERE id IN(SELECT MAX(id) id\n" +
        "FROM [Crawler].[dbo].[外销电商_内销爬虫数据]\n" +
        "GROUP BY 材质,品名,规格,等级,表面处理,分类,图片,品牌,仓库,库存,包装信息,价格,CONVERT(varchar(100), CAST(更新日期 AS DATETIME), 23)\n" +
        "HAVING COUNT(1)>1 )"
    sql.query(connectionString, sqlquery, (err, rows) => {
        //console.log(rows);
        if (err != null && err != undefined && err != 'undefined') {
            console.log(err);
        }
    });
}