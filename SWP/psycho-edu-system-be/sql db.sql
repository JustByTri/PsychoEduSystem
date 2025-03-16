USE [master]
GO
/****** Object:  Database [PsyTable]    Script Date: 3/16/2025 10:55:20 PM ******/
CREATE DATABASE [PsyTable]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'PsyTable', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\PsyTable.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'PsyTable_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\PsyTable_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [PsyTable] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [PsyTable].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [PsyTable] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [PsyTable] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [PsyTable] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [PsyTable] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [PsyTable] SET ARITHABORT OFF 
GO
ALTER DATABASE [PsyTable] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [PsyTable] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [PsyTable] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [PsyTable] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [PsyTable] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [PsyTable] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [PsyTable] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [PsyTable] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [PsyTable] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [PsyTable] SET  ENABLE_BROKER 
GO
ALTER DATABASE [PsyTable] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [PsyTable] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [PsyTable] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [PsyTable] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [PsyTable] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [PsyTable] SET READ_COMMITTED_SNAPSHOT ON 
GO
ALTER DATABASE [PsyTable] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [PsyTable] SET RECOVERY FULL 
GO
ALTER DATABASE [PsyTable] SET  MULTI_USER 
GO
ALTER DATABASE [PsyTable] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [PsyTable] SET DB_CHAINING OFF 
GO
ALTER DATABASE [PsyTable] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [PsyTable] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [PsyTable] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [PsyTable] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'PsyTable', N'ON'
GO
ALTER DATABASE [PsyTable] SET QUERY_STORE = ON
GO
ALTER DATABASE [PsyTable] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [PsyTable]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 3/16/2025 10:55:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Answers]    Script Date: 3/16/2025 10:55:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Answers](
	[AnswerId] [uniqueidentifier] NOT NULL,
	[QuestionId] [uniqueidentifier] NOT NULL,
	[Point] [int] NOT NULL,
	[Content] [nvarchar](max) NOT NULL,
	[UpdatedTime] [datetime2](7) NULL,
	[CreateAt] [datetime2](7) NULL,
 CONSTRAINT [PK_Answers] PRIMARY KEY CLUSTERED 
(
	[AnswerId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Appointments]    Script Date: 3/16/2025 10:55:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Appointments](
	[AppointmentId] [uniqueidentifier] NOT NULL,
	[SlotId] [int] NOT NULL,
	[BookedBy] [uniqueidentifier] NOT NULL,
	[AppointmentFor] [uniqueidentifier] NOT NULL,
	[MeetingWith] [uniqueidentifier] NOT NULL,
	[Date] [date] NOT NULL,
	[GoogleMeet] [nvarchar](max) NOT NULL,
	[Notes] [nvarchar](max) NOT NULL,
	[IsOnline] [bit] NOT NULL,
	[IsCompleted] [bit] NOT NULL,
	[IsCanceled] [bit] NOT NULL,
	[CreateAt] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Appointments] PRIMARY KEY CLUSTERED 
(
	[AppointmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Categories]    Script Date: 3/16/2025 10:55:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Categories](
	[DimensionId] [int] IDENTITY(1,1) NOT NULL,
	[DimensionName] [nvarchar](max) NOT NULL,
	[CreateAt] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Categories] PRIMARY KEY CLUSTERED 
(
	[DimensionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Classes]    Script Date: 3/16/2025 10:55:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Classes](
	[ClassId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](max) NOT NULL,
	[TeacherId] [uniqueidentifier] NOT NULL,
	[CreateAt] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Classes] PRIMARY KEY CLUSTERED 
(
	[ClassId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MentalHealthPointDetails]    Script Date: 3/16/2025 10:55:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MentalHealthPointDetails](
	[MentalHPDetailId] [uniqueidentifier] NOT NULL,
	[DimensionId] [int] NOT NULL,
	[HealthPoints] [int] NOT NULL,
	[DimensionName] [nvarchar](max) NOT NULL,
	[SurveyResponseId] [uniqueidentifier] NOT NULL,
	[CreateAt] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_MentalHealthPointDetails] PRIMARY KEY CLUSTERED 
(
	[MentalHPDetailId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Messages]    Script Date: 3/16/2025 10:55:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Messages](
	[MessageId] [uniqueidentifier] NOT NULL,
	[StudentId] [uniqueidentifier] NOT NULL,
	[OwnerId] [uniqueidentifier] NOT NULL,
	[Content] [nvarchar](max) NOT NULL,
	[CreateAt] [datetime2](7) NULL,
 CONSTRAINT [PK_Messages] PRIMARY KEY CLUSTERED 
(
	[MessageId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProgramEnrollments]    Script Date: 3/16/2025 10:55:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProgramEnrollments](
	[ProgramId] [uniqueidentifier] NOT NULL,
	[StudentId] [uniqueidentifier] NOT NULL,
	[Status] [nvarchar](max) NULL,
	[EnrolledAt] [datetime2](7) NOT NULL,
	[CreateAt] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ProgramEnrollments] PRIMARY KEY CLUSTERED 
(
	[ProgramId] ASC,
	[StudentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[QuestionSets]    Script Date: 3/16/2025 10:55:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[QuestionSets](
	[QuestionId] [uniqueidentifier] NOT NULL,
	[Content] [nvarchar](max) NOT NULL,
	[UpdateTime] [datetime2](7) NULL,
	[CreateAt] [datetime2](7) NULL,
	[SurveyId] [uniqueidentifier] NOT NULL,
	[DimensionId] [int] NOT NULL,
 CONSTRAINT [PK_QuestionSets] PRIMARY KEY CLUSTERED 
(
	[QuestionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RefreshTokens]    Script Date: 3/16/2025 10:55:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RefreshTokens](
	[RefreshTokenId] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NOT NULL,
	[RefreshTokenKey] [nvarchar](max) NOT NULL,
	[IsRevoked] [bit] NOT NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_RefreshTokens] PRIMARY KEY CLUSTERED 
(
	[RefreshTokenId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Relationships]    Script Date: 3/16/2025 10:55:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Relationships](
	[RelationshipId] [uniqueidentifier] NOT NULL,
	[ParentId] [uniqueidentifier] NOT NULL,
	[StudentId] [uniqueidentifier] NOT NULL,
	[RelationshipName] [nvarchar](max) NOT NULL,
	[CreateAt] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Relationships] PRIMARY KEY CLUSTERED 
(
	[RelationshipId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RequestAppointments]    Script Date: 3/16/2025 10:55:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RequestAppointments](
	[RequestId] [uniqueidentifier] NOT NULL,
	[StudentId] [uniqueidentifier] NOT NULL,
	[SlotId] [int] NOT NULL,
	[IsBooking] [bit] NOT NULL,
	[IsSend] [bit] NOT NULL,
	[IsScheduled] [bit] NOT NULL,
	[IsDeposit] [bit] NOT NULL,
	[IsCheckedIn] [bit] NOT NULL,
	[CreateAt] [datetime2](7) NULL,
	[UserId] [uniqueidentifier] NULL,
 CONSTRAINT [PK_RequestAppointments] PRIMARY KEY CLUSTERED 
(
	[RequestId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 3/16/2025 10:55:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[RoleId] [int] IDENTITY(1,1) NOT NULL,
	[RoleName] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_Roles] PRIMARY KEY CLUSTERED 
(
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Schedules]    Script Date: 3/16/2025 10:55:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Schedules](
	[ScheduleId] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NOT NULL,
	[SlotId] [int] NOT NULL,
	[Date] [datetime2](7) NOT NULL,
	[CreateAt] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Schedules] PRIMARY KEY CLUSTERED 
(
	[ScheduleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Slots]    Script Date: 3/16/2025 10:55:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Slots](
	[SlotId] [int] IDENTITY(1,1) NOT NULL,
	[SlotName] [nvarchar](max) NOT NULL,
	[CreateAt] [datetime2](7) NULL,
	[UserId] [uniqueidentifier] NULL,
 CONSTRAINT [PK_Slots] PRIMARY KEY CLUSTERED 
(
	[SlotId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SurveyAnswerUsers]    Script Date: 3/16/2025 10:55:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SurveyAnswerUsers](
	[SurveyAnswerUserId] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NOT NULL,
	[SurveyId] [uniqueidentifier] NOT NULL,
	[SurveyResponseId] [uniqueidentifier] NOT NULL,
	[QuestionId] [uniqueidentifier] NOT NULL,
	[AnswerId] [uniqueidentifier] NOT NULL,
	[UserPoint] [int] NOT NULL,
	[CreateAt] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_SurveyAnswerUsers] PRIMARY KEY CLUSTERED 
(
	[SurveyAnswerUserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SurveyResponses]    Script Date: 3/16/2025 10:55:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SurveyResponses](
	[SurveyResponseId] [uniqueidentifier] NOT NULL,
	[SurveyTakerId] [uniqueidentifier] NOT NULL,
	[SurveyTargetId] [uniqueidentifier] NOT NULL,
	[HealthPoints] [int] NOT NULL,
	[CreateAt] [datetime2](7) NOT NULL,
	[SurveyId] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_SurveyResponses] PRIMARY KEY CLUSTERED 
(
	[SurveyResponseId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Surveys]    Script Date: 3/16/2025 10:55:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Surveys](
	[SurveyId] [uniqueidentifier] NOT NULL,
	[SurveyName] [nvarchar](max) NOT NULL,
	[Description] [nvarchar](max) NOT NULL,
	[IsPublic] [bit] NOT NULL,
	[SurveyFor] [nvarchar](max) NOT NULL,
	[CreateAt] [datetime2](7) NOT NULL,
	[UpdateAt] [datetime2](7) NOT NULL,
	[UserId] [uniqueidentifier] NULL,
 CONSTRAINT [PK_Surveys] PRIMARY KEY CLUSTERED 
(
	[SurveyId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TargetPrograms]    Script Date: 3/16/2025 10:55:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TargetPrograms](
	[ProgramId] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](max) NOT NULL,
	[CounselorId] [uniqueidentifier] NOT NULL,
	[Description] [nvarchar](max) NOT NULL,
	[StartDate] [datetime2](7) NOT NULL,
	[MinPoint] [int] NOT NULL,
	[CurrentCapacity] [int] NOT NULL,
	[Capacity] [int] NOT NULL,
	[CreateAt] [datetime2](7) NOT NULL,
	[DimensionId] [int] NOT NULL,
 CONSTRAINT [PK_TargetPrograms] PRIMARY KEY CLUSTERED 
(
	[ProgramId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 3/16/2025 10:55:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[UserId] [uniqueidentifier] NOT NULL,
	[UserName] [nvarchar](30) NOT NULL,
	[GoogleMeetURL] [nvarchar](max) NOT NULL,
	[FirstName] [nvarchar](max) NULL,
	[LastName] [nvarchar](max) NULL,
	[PasswordHash] [varbinary](max) NOT NULL,
	[PasswordSalt] [varbinary](max) NOT NULL,
	[Phone] [nvarchar](max) NOT NULL,
	[Email] [nvarchar](max) NOT NULL,
	[FullName] [nvarchar](30) NOT NULL,
	[BirthDay] [datetime2](7) NOT NULL,
	[Gender] [nvarchar](max) NOT NULL,
	[Address] [nvarchar](max) NOT NULL,
	[Status] [bit] NOT NULL,
	[RoleId] [int] NOT NULL,
	[IsEmailConfirmed] [bit] NOT NULL,
	[CreateAt] [datetime2](7) NULL,
	[ClassId] [int] NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Videos]    Script Date: 3/16/2025 10:55:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Videos](
	[VideoId] [uniqueidentifier] NOT NULL,
	[Content] [nvarchar](max) NOT NULL,
	[Title] [nvarchar](max) NOT NULL,
	[ContentType] [nvarchar](max) NOT NULL,
	[UpdateAt] [datetime2](7) NULL,
	[CreateAt] [datetime2](7) NULL,
 CONSTRAINT [PK_Videos] PRIMARY KEY CLUSTERED 
(
	[VideoId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Index [IX_Answers_QuestionId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_Answers_QuestionId] ON [dbo].[Answers]
(
	[QuestionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Appointments_AppointmentFor]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_Appointments_AppointmentFor] ON [dbo].[Appointments]
(
	[AppointmentFor] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Appointments_BookedBy]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_Appointments_BookedBy] ON [dbo].[Appointments]
(
	[BookedBy] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Appointments_MeetingWith]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_Appointments_MeetingWith] ON [dbo].[Appointments]
(
	[MeetingWith] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Appointments_SlotId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_Appointments_SlotId] ON [dbo].[Appointments]
(
	[SlotId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Classes_TeacherId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_Classes_TeacherId] ON [dbo].[Classes]
(
	[TeacherId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_MentalHealthPointDetails_DimensionId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_MentalHealthPointDetails_DimensionId] ON [dbo].[MentalHealthPointDetails]
(
	[DimensionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_MentalHealthPointDetails_SurveyResponseId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_MentalHealthPointDetails_SurveyResponseId] ON [dbo].[MentalHealthPointDetails]
(
	[SurveyResponseId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Messages_OwnerId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_Messages_OwnerId] ON [dbo].[Messages]
(
	[OwnerId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Messages_StudentId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_Messages_StudentId] ON [dbo].[Messages]
(
	[StudentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_ProgramEnrollments_StudentId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_ProgramEnrollments_StudentId] ON [dbo].[ProgramEnrollments]
(
	[StudentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_QuestionSets_DimensionId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_QuestionSets_DimensionId] ON [dbo].[QuestionSets]
(
	[DimensionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_QuestionSets_SurveyId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_QuestionSets_SurveyId] ON [dbo].[QuestionSets]
(
	[SurveyId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_RefreshTokens_UserId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_RefreshTokens_UserId] ON [dbo].[RefreshTokens]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Relationships_ParentId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_Relationships_ParentId] ON [dbo].[Relationships]
(
	[ParentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Relationships_StudentId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_Relationships_StudentId] ON [dbo].[Relationships]
(
	[StudentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_RequestAppointments_SlotId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_RequestAppointments_SlotId] ON [dbo].[RequestAppointments]
(
	[SlotId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_RequestAppointments_StudentId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_RequestAppointments_StudentId] ON [dbo].[RequestAppointments]
(
	[StudentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_RequestAppointments_UserId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_RequestAppointments_UserId] ON [dbo].[RequestAppointments]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Schedules_SlotId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_Schedules_SlotId] ON [dbo].[Schedules]
(
	[SlotId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Schedules_UserId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_Schedules_UserId] ON [dbo].[Schedules]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Slots_UserId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_Slots_UserId] ON [dbo].[Slots]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_SurveyAnswerUsers_AnswerId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_SurveyAnswerUsers_AnswerId] ON [dbo].[SurveyAnswerUsers]
(
	[AnswerId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_SurveyAnswerUsers_QuestionId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_SurveyAnswerUsers_QuestionId] ON [dbo].[SurveyAnswerUsers]
(
	[QuestionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_SurveyAnswerUsers_SurveyId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_SurveyAnswerUsers_SurveyId] ON [dbo].[SurveyAnswerUsers]
(
	[SurveyId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_SurveyAnswerUsers_SurveyResponseId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_SurveyAnswerUsers_SurveyResponseId] ON [dbo].[SurveyAnswerUsers]
(
	[SurveyResponseId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_SurveyAnswerUsers_UserId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_SurveyAnswerUsers_UserId] ON [dbo].[SurveyAnswerUsers]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_SurveyResponses_SurveyId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_SurveyResponses_SurveyId] ON [dbo].[SurveyResponses]
(
	[SurveyId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_SurveyResponses_SurveyTakerId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_SurveyResponses_SurveyTakerId] ON [dbo].[SurveyResponses]
(
	[SurveyTakerId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_SurveyResponses_SurveyTargetId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_SurveyResponses_SurveyTargetId] ON [dbo].[SurveyResponses]
(
	[SurveyTargetId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Surveys_UserId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_Surveys_UserId] ON [dbo].[Surveys]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_TargetPrograms_CounselorId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_TargetPrograms_CounselorId] ON [dbo].[TargetPrograms]
(
	[CounselorId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_TargetPrograms_DimensionId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_TargetPrograms_DimensionId] ON [dbo].[TargetPrograms]
(
	[DimensionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Users_ClassId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_Users_ClassId] ON [dbo].[Users]
(
	[ClassId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Users_RoleId]    Script Date: 3/16/2025 10:55:21 PM ******/
CREATE NONCLUSTERED INDEX [IX_Users_RoleId] ON [dbo].[Users]
(
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Answers] ADD  DEFAULT (getdate()) FOR [CreateAt]
GO
ALTER TABLE [dbo].[QuestionSets] ADD  DEFAULT (getdate()) FOR [CreateAt]
GO
ALTER TABLE [dbo].[Answers]  WITH CHECK ADD  CONSTRAINT [FK_Answers_QuestionSets_QuestionId] FOREIGN KEY([QuestionId])
REFERENCES [dbo].[QuestionSets] ([QuestionId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Answers] CHECK CONSTRAINT [FK_Answers_QuestionSets_QuestionId]
GO
ALTER TABLE [dbo].[Appointments]  WITH CHECK ADD  CONSTRAINT [FK_Appointments_Slots_SlotId] FOREIGN KEY([SlotId])
REFERENCES [dbo].[Slots] ([SlotId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Appointments] CHECK CONSTRAINT [FK_Appointments_Slots_SlotId]
GO
ALTER TABLE [dbo].[Appointments]  WITH CHECK ADD  CONSTRAINT [FK_Appointments_Users_AppointmentFor] FOREIGN KEY([AppointmentFor])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Appointments] CHECK CONSTRAINT [FK_Appointments_Users_AppointmentFor]
GO
ALTER TABLE [dbo].[Appointments]  WITH CHECK ADD  CONSTRAINT [FK_Appointments_Users_BookedBy] FOREIGN KEY([BookedBy])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Appointments] CHECK CONSTRAINT [FK_Appointments_Users_BookedBy]
GO
ALTER TABLE [dbo].[Appointments]  WITH CHECK ADD  CONSTRAINT [FK_Appointments_Users_MeetingWith] FOREIGN KEY([MeetingWith])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Appointments] CHECK CONSTRAINT [FK_Appointments_Users_MeetingWith]
GO
ALTER TABLE [dbo].[Classes]  WITH CHECK ADD  CONSTRAINT [FK_Classes_Users_TeacherId] FOREIGN KEY([TeacherId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Classes] CHECK CONSTRAINT [FK_Classes_Users_TeacherId]
GO
ALTER TABLE [dbo].[MentalHealthPointDetails]  WITH CHECK ADD  CONSTRAINT [FK_MentalHealthPointDetails_Categories_DimensionId] FOREIGN KEY([DimensionId])
REFERENCES [dbo].[Categories] ([DimensionId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[MentalHealthPointDetails] CHECK CONSTRAINT [FK_MentalHealthPointDetails_Categories_DimensionId]
GO
ALTER TABLE [dbo].[MentalHealthPointDetails]  WITH CHECK ADD  CONSTRAINT [FK_MentalHealthPointDetails_SurveyResponses_SurveyResponseId] FOREIGN KEY([SurveyResponseId])
REFERENCES [dbo].[SurveyResponses] ([SurveyResponseId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[MentalHealthPointDetails] CHECK CONSTRAINT [FK_MentalHealthPointDetails_SurveyResponses_SurveyResponseId]
GO
ALTER TABLE [dbo].[Messages]  WITH CHECK ADD  CONSTRAINT [FK_Messages_Users_OwnerId] FOREIGN KEY([OwnerId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Messages] CHECK CONSTRAINT [FK_Messages_Users_OwnerId]
GO
ALTER TABLE [dbo].[Messages]  WITH CHECK ADD  CONSTRAINT [FK_Messages_Users_StudentId] FOREIGN KEY([StudentId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Messages] CHECK CONSTRAINT [FK_Messages_Users_StudentId]
GO
ALTER TABLE [dbo].[ProgramEnrollments]  WITH CHECK ADD  CONSTRAINT [FK_ProgramEnrollments_TargetPrograms_ProgramId] FOREIGN KEY([ProgramId])
REFERENCES [dbo].[TargetPrograms] ([ProgramId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ProgramEnrollments] CHECK CONSTRAINT [FK_ProgramEnrollments_TargetPrograms_ProgramId]
GO
ALTER TABLE [dbo].[ProgramEnrollments]  WITH CHECK ADD  CONSTRAINT [FK_ProgramEnrollments_Users_StudentId] FOREIGN KEY([StudentId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[ProgramEnrollments] CHECK CONSTRAINT [FK_ProgramEnrollments_Users_StudentId]
GO
ALTER TABLE [dbo].[QuestionSets]  WITH CHECK ADD  CONSTRAINT [FK_QuestionSets_Categories_DimensionId] FOREIGN KEY([DimensionId])
REFERENCES [dbo].[Categories] ([DimensionId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[QuestionSets] CHECK CONSTRAINT [FK_QuestionSets_Categories_DimensionId]
GO
ALTER TABLE [dbo].[QuestionSets]  WITH CHECK ADD  CONSTRAINT [FK_QuestionSets_Surveys_SurveyId] FOREIGN KEY([SurveyId])
REFERENCES [dbo].[Surveys] ([SurveyId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[QuestionSets] CHECK CONSTRAINT [FK_QuestionSets_Surveys_SurveyId]
GO
ALTER TABLE [dbo].[RefreshTokens]  WITH CHECK ADD  CONSTRAINT [FK_RefreshTokens_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[RefreshTokens] CHECK CONSTRAINT [FK_RefreshTokens_Users_UserId]
GO
ALTER TABLE [dbo].[Relationships]  WITH CHECK ADD  CONSTRAINT [FK_Relationships_Users_ParentId] FOREIGN KEY([ParentId])
REFERENCES [dbo].[Users] ([UserId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Relationships] CHECK CONSTRAINT [FK_Relationships_Users_ParentId]
GO
ALTER TABLE [dbo].[Relationships]  WITH CHECK ADD  CONSTRAINT [FK_Relationships_Users_StudentId] FOREIGN KEY([StudentId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Relationships] CHECK CONSTRAINT [FK_Relationships_Users_StudentId]
GO
ALTER TABLE [dbo].[RequestAppointments]  WITH CHECK ADD  CONSTRAINT [FK_RequestAppointments_Slots_SlotId] FOREIGN KEY([SlotId])
REFERENCES [dbo].[Slots] ([SlotId])
GO
ALTER TABLE [dbo].[RequestAppointments] CHECK CONSTRAINT [FK_RequestAppointments_Slots_SlotId]
GO
ALTER TABLE [dbo].[RequestAppointments]  WITH CHECK ADD  CONSTRAINT [FK_RequestAppointments_Users_StudentId] FOREIGN KEY([StudentId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[RequestAppointments] CHECK CONSTRAINT [FK_RequestAppointments_Users_StudentId]
GO
ALTER TABLE [dbo].[RequestAppointments]  WITH CHECK ADD  CONSTRAINT [FK_RequestAppointments_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[RequestAppointments] CHECK CONSTRAINT [FK_RequestAppointments_Users_UserId]
GO
ALTER TABLE [dbo].[Schedules]  WITH CHECK ADD  CONSTRAINT [FK_Schedules_Slots_SlotId] FOREIGN KEY([SlotId])
REFERENCES [dbo].[Slots] ([SlotId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Schedules] CHECK CONSTRAINT [FK_Schedules_Slots_SlotId]
GO
ALTER TABLE [dbo].[Schedules]  WITH CHECK ADD  CONSTRAINT [FK_Schedules_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Schedules] CHECK CONSTRAINT [FK_Schedules_Users_UserId]
GO
ALTER TABLE [dbo].[Slots]  WITH CHECK ADD  CONSTRAINT [FK_Slots_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Slots] CHECK CONSTRAINT [FK_Slots_Users_UserId]
GO
ALTER TABLE [dbo].[SurveyAnswerUsers]  WITH CHECK ADD  CONSTRAINT [FK_SurveyAnswerUsers_Answers_AnswerId] FOREIGN KEY([AnswerId])
REFERENCES [dbo].[Answers] ([AnswerId])
GO
ALTER TABLE [dbo].[SurveyAnswerUsers] CHECK CONSTRAINT [FK_SurveyAnswerUsers_Answers_AnswerId]
GO
ALTER TABLE [dbo].[SurveyAnswerUsers]  WITH CHECK ADD  CONSTRAINT [FK_SurveyAnswerUsers_QuestionSets_QuestionId] FOREIGN KEY([QuestionId])
REFERENCES [dbo].[QuestionSets] ([QuestionId])
GO
ALTER TABLE [dbo].[SurveyAnswerUsers] CHECK CONSTRAINT [FK_SurveyAnswerUsers_QuestionSets_QuestionId]
GO
ALTER TABLE [dbo].[SurveyAnswerUsers]  WITH CHECK ADD  CONSTRAINT [FK_SurveyAnswerUsers_SurveyResponses_SurveyResponseId] FOREIGN KEY([SurveyResponseId])
REFERENCES [dbo].[SurveyResponses] ([SurveyResponseId])
GO
ALTER TABLE [dbo].[SurveyAnswerUsers] CHECK CONSTRAINT [FK_SurveyAnswerUsers_SurveyResponses_SurveyResponseId]
GO
ALTER TABLE [dbo].[SurveyAnswerUsers]  WITH CHECK ADD  CONSTRAINT [FK_SurveyAnswerUsers_Surveys_SurveyId] FOREIGN KEY([SurveyId])
REFERENCES [dbo].[Surveys] ([SurveyId])
GO
ALTER TABLE [dbo].[SurveyAnswerUsers] CHECK CONSTRAINT [FK_SurveyAnswerUsers_Surveys_SurveyId]
GO
ALTER TABLE [dbo].[SurveyAnswerUsers]  WITH CHECK ADD  CONSTRAINT [FK_SurveyAnswerUsers_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[SurveyAnswerUsers] CHECK CONSTRAINT [FK_SurveyAnswerUsers_Users_UserId]
GO
ALTER TABLE [dbo].[SurveyResponses]  WITH CHECK ADD  CONSTRAINT [FK_SurveyResponses_Surveys_SurveyId] FOREIGN KEY([SurveyId])
REFERENCES [dbo].[Surveys] ([SurveyId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[SurveyResponses] CHECK CONSTRAINT [FK_SurveyResponses_Surveys_SurveyId]
GO
ALTER TABLE [dbo].[SurveyResponses]  WITH CHECK ADD  CONSTRAINT [FK_SurveyResponses_Users_SurveyTakerId] FOREIGN KEY([SurveyTakerId])
REFERENCES [dbo].[Users] ([UserId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[SurveyResponses] CHECK CONSTRAINT [FK_SurveyResponses_Users_SurveyTakerId]
GO
ALTER TABLE [dbo].[SurveyResponses]  WITH CHECK ADD  CONSTRAINT [FK_SurveyResponses_Users_SurveyTargetId] FOREIGN KEY([SurveyTargetId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[SurveyResponses] CHECK CONSTRAINT [FK_SurveyResponses_Users_SurveyTargetId]
GO
ALTER TABLE [dbo].[Surveys]  WITH CHECK ADD  CONSTRAINT [FK_Surveys_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Surveys] CHECK CONSTRAINT [FK_Surveys_Users_UserId]
GO
ALTER TABLE [dbo].[TargetPrograms]  WITH CHECK ADD  CONSTRAINT [FK_TargetPrograms_Categories_DimensionId] FOREIGN KEY([DimensionId])
REFERENCES [dbo].[Categories] ([DimensionId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[TargetPrograms] CHECK CONSTRAINT [FK_TargetPrograms_Categories_DimensionId]
GO
ALTER TABLE [dbo].[TargetPrograms]  WITH CHECK ADD  CONSTRAINT [FK_TargetPrograms_Users_CounselorId] FOREIGN KEY([CounselorId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[TargetPrograms] CHECK CONSTRAINT [FK_TargetPrograms_Users_CounselorId]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_Classes_ClassId] FOREIGN KEY([ClassId])
REFERENCES [dbo].[Classes] ([ClassId])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_Classes_ClassId]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_Roles_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[Roles] ([RoleId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_Roles_RoleId]
GO
USE [master]
GO
ALTER DATABASE [PsyTable] SET  READ_WRITE 
GO
