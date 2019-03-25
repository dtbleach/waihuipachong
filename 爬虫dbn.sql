https://blog.csdn.net/qq_25968195/article/details/79142755

USE [Crawler]
GO

/****** Object:  Table [dbo].[��������_������������]    Script Date: 03/22/2019 16:49:05 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[��������_������������](
	[id] [INT] IDENTITY(1,1) NOT NULL,
	[����] [NVARCHAR](200) NULL,
	[Ʒ��] [NVARCHAR](200) NULL,
	[���] [NVARCHAR](200) NULL,
	[�ȼ�] [NVARCHAR](50) NULL,
	[���洦��] [NVARCHAR](200) NULL,
	[����] [NVARCHAR](200) NULL,
	[ͼƬ] [NVARCHAR](MAX) NULL,
	[Ʒ��] [NVARCHAR](200) NULL,
	[�ֿ�] [NVARCHAR](200) NULL,
	[���] [NVARCHAR](200) NULL,
	[��װ��Ϣ] [NVARCHAR](200) NULL,
	[�۸�] [NVARCHAR](200) NULL,
	[������Դ] [NVARCHAR](200) NULL,
	[��������] [NVARCHAR](100) NULL,
 CONSTRAINT [PK_��������_������������] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[��������_������������] ADD  CONSTRAINT [DF_��������_������������_��������]  DEFAULT (GETDATE()) FOR [��������]
GO


/****** Script for SelectTopNRows command from SSMS  ******/
SELECT [id]
      ,[����]
      ,[Ʒ��]
      ,[���]
      ,[�ȼ�]
      ,[���洦��]
      ,[����]
      ,[ͼƬ]
      ,[Ʒ��]
      ,[�ֿ�]
      ,[���]
      ,[��װ��Ϣ]
      ,[�۸�]
      ,[������Դ]
      ,[��������]
  FROM [Crawler].[dbo].[��������_������������]
  where ����='35K(̼��)' and Ʒ��='GB70-76'	and ���='M4*12' and �ȼ�='8.8��' and ���洦��='����п' and ����='������Բ��ͷ���ݶ�' and ͼƬ='p5.gpyh.com/webnew/img/standardConfig/5/6ce0d23f-ce2a-40d7-b3d5-44ae1e03034a.jpg' and Ʒ��='��ʿ' and �ֿ�='������Ӫ��' and ���='21.6ǧ֧�ֻ�'


  --delete from Crawler.dbo.��������_������������

delete from [Crawler].[dbo].[��������_������������] where

id in(select * from [Crawler].[dbo].[��������_������������] group by ����,Ʒ��,���,�ȼ�,���洦��,����,ͼƬ,Ʒ��,�ֿ�,���,��װ��Ϣ,�۸� having count(1) >= 2)

and id not in (select max(id)from [dbo].[��������_������������] group by id having count(1) >1)

delete from  [Crawler].[dbo].[��������_������������] where id in(SELECT max(a.id) FROM [Crawler].[dbo].[��������_������������] a,(
SELECT ����,Ʒ��,���,�ȼ�,���洦��,����,ͼƬ,Ʒ��,�ֿ�,���,��װ��Ϣ,�۸�
FROM [Crawler].[dbo].[��������_������������]
GROUP BY ����,Ʒ��,���,�ȼ�,���洦��,����,ͼƬ,Ʒ��,�ֿ�,���,��װ��Ϣ,�۸�
HAVING COUNT(1)>1

) AS b
WHERE a.����=b.���� and a.Ʒ��=b.Ʒ�� and a.���=b.��� and a.�ȼ�=b.�ȼ� and a.���洦��=b.���洦�� and a.����=b.���� and a.ͼƬ=b.ͼƬ and a.Ʒ��=b.Ʒ�� and a.�ֿ�=b.�ֿ� and a.���=b.��� and a.��װ��Ϣ=b.��װ��Ϣ and a.�۸�=b.�۸�
)

