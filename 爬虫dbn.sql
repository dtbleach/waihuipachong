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


