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


