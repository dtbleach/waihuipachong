https://blog.csdn.net/qq_25968195/article/details/79142755

USE [Crawler]
GO

/****** Object:  Table [dbo].[外销电商_内销爬虫数据]    Script Date: 03/22/2019 16:49:05 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[外销电商_内销爬虫数据](
	[id] [INT] IDENTITY(1,1) NOT NULL,
	[材质] [NVARCHAR](200) NULL,
	[品名] [NVARCHAR](200) NULL,
	[规格] [NVARCHAR](200) NULL,
	[等级] [NVARCHAR](50) NULL,
	[表面处理] [NVARCHAR](200) NULL,
	[分类] [NVARCHAR](200) NULL,
	[图片] [NVARCHAR](MAX) NULL,
	[品牌] [NVARCHAR](200) NULL,
	[仓库] [NVARCHAR](200) NULL,
	[库存] [NVARCHAR](200) NULL,
	[包装信息] [NVARCHAR](200) NULL,
	[价格] [NVARCHAR](200) NULL,
	[数据来源] [NVARCHAR](200) NULL,
	[更新日期] [NVARCHAR](100) NULL,
 CONSTRAINT [PK_外销电商_内销爬虫数据] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[外销电商_内销爬虫数据] ADD  CONSTRAINT [DF_外销电商_内销爬虫数据_更新日期]  DEFAULT (GETDATE()) FOR [更新日期]
GO


/****** Script for SelectTopNRows command from SSMS  ******/
SELECT [id]
      ,[材质]
      ,[品名]
      ,[规格]
      ,[等级]
      ,[表面处理]
      ,[分类]
      ,[图片]
      ,[品牌]
      ,[仓库]
      ,[库存]
      ,[包装信息]
      ,[价格]
      ,[数据来源]
      ,[更新日期]
  FROM [Crawler].[dbo].[外销电商_内销爬虫数据]
  where 材质='35K(碳钢)' and 品名='GB70-76'	and 规格='M4*12' and 等级='8.8级' and 表面处理='蓝白锌' and 分类='内六角圆柱头机螺钉' and 图片='p5.gpyh.com/webnew/img/standardConfig/5/6ce0d23f-ce2a-40d7-b3d5-44ae1e03034a.jpg' and 品牌='工士' and 仓库='嘉兴自营仓' and 库存='21.6千支现货'


  --delete from Crawler.dbo.外销电商_内销爬虫数据

delete from [Crawler].[dbo].[外销电商_内销爬虫数据] where

id in(select * from [Crawler].[dbo].[外销电商_内销爬虫数据] group by 材质,品名,规格,等级,表面处理,分类,图片,品牌,仓库,库存,包装信息,价格 having count(1) >= 2)

and id not in (select max(id)from [dbo].[外销电商_内销爬虫数据] group by id having count(1) >1)

delete from  [Crawler].[dbo].[外销电商_内销爬虫数据] where id in(SELECT max(a.id) FROM [Crawler].[dbo].[外销电商_内销爬虫数据] a,(
SELECT 材质,品名,规格,等级,表面处理,分类,图片,品牌,仓库,库存,包装信息,价格
FROM [Crawler].[dbo].[外销电商_内销爬虫数据]
GROUP BY 材质,品名,规格,等级,表面处理,分类,图片,品牌,仓库,库存,包装信息,价格
HAVING COUNT(1)>1

) AS b
WHERE a.材质=b.材质 and a.品名=b.品名 and a.规格=b.规格 and a.等级=b.等级 and a.表面处理=b.表面处理 and a.分类=b.分类 and a.图片=b.图片 and a.品牌=b.品牌 and a.仓库=b.仓库 and a.库存=b.库存 and a.包装信息=b.包装信息 and a.价格=b.价格
)

