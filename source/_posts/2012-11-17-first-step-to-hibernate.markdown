---
layout: post
title: "First Step to Using Hibernate"
date: 2012-11-17 21:57
comments: true
categories: Hibernate Java
---

## 前言

Java大作业是这个学期我花的时间最长的一次作业了。作业要求是先用文本文件实现持久化，然后再用数据库实现。后来老师又说可以直接用数据库实现，但是那时我已经差不多把文本文件实现的那部分功能做出来了，只能坚持继续做下去。下周就要交数据库实现版本，口头上说说工作量应该不大，因为只需要将存取数据的接口重新实现就好了。但是这之间我遇到了很多麻烦。

* 首先我看了下MySQL文档中关于Java连接的文档，好像很方便，不考虑性能什么的话，只需要包含一个Jar包，就可以进行数据库操作。于是我去网上找了一个Demo，嗯，运行状况良好。但是一细想，这个和我之前设计的用JAXB的方式出入太大，恐怕不好整合。于是去网上找了之前听说过的Hibernate.

* 接下来就说我用了一整天的时间来琢磨这个Hibernate的故事。

## 总体感觉

实验室的网络让我疯狂！GoAgent一直用不顺，大概是因为实验室把IPV6封了的缘故，有毛病！

`不知所措` -> `无奈挣扎`-> `痛苦！` -> `痛苦！` -> `痛苦！` -> `痛苦！` -> `喜悦`

<!--more-->
## 安装配置。

其实无所谓安装配置了（不要理我，刚刚解决了一个问题，头脑混乱）。

* 去[Hibernate的Sourceforge项目托管地址](http://sourceforge.net/projects/hibernate/files/hibernate3/)下载。
强烈建议下载Hibernate3.X的，因为暂时4.X好像还不成熟，网上很多例子也是基于3.X甚至2.X的。

* 解压缩下载的安装包，然后是比较恶心的类库的选择。lib/required和根目录下的Hibernate.jar是必须要的，其他的看自己情况而定，或者说运行时候出错了，可以加上。

* 在项目文件夹下建一个lib（名字其实随意）目录，将上面的所有Jar文件放到这个目录下面。然后添加到项目的build Path。

## 日志的处理

由于作业是要求用命令行的，如果把日志显示在Console中就显得非常蛋疼。然而仅仅怎么不让日志显示在Console就花了我一个晚上的时间，虽然是一边看《雷霆扫毒》，一边写代码可能效率有点低。但是一个晚上啊魂淡！

现在理顺了就很简单。

首先就是下载`slf4j-1.6.1`的压缩包，然后选其中的`slf4j-api-1.6.1.jar`和`slf4j-log4j12-1.6.1.jar`，放到build path当中。后者相当于是将slf4j和log4j之间的一个转换器。

然后从Hibernate的project/etc中复制出`log4j.properties`文件，稍微改一下即可，具体的代码可以见最后给出的项目源代码。

好吧，还是贴一下配置文件吧，一个所谓的技术博客都是吐槽算是怎么回事。。。

{% codeblock %}
### direct log messages to stdout ###
#log4j.appender.stdout=org.apache.log4j.ConsoleAppender
#log4j.appender.stdout.Target=System.out
#log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
#log4j.appender.stdout.layout.ConversionPattern=%d{ABSOLUTE} %5p %c{1}:%L - %m%n

### direct messages to file hibernate.log ###
log4j.appender.file=org.apache.log4j.FileAppender
log4j.appender.file.File=hibernate.log
log4j.appender.file.layout=org.apache.log4j.PatternLayout
log4j.appender.file.layout.ConversionPattern=%d{ABSOLUTE} %5p %c{1}:%L - %m%n

### set log levels - for more verbose logging change 'info' to 'debug' ###

log4j.rootLogger=warn, file

#log4j.logger.org.hibernate=info
log4j.logger.org.hibernate=debug

### log HQL query parser activity
#log4j.logger.org.hibernate.hql.ast.AST=debug

### log just the SQL
#log4j.logger.org.hibernate.SQL=debug

### log JDBC bind parameters ###
log4j.logger.org.hibernate.type=info
#log4j.logger.org.hibernate.type=debug

### log schema export/update ###
log4j.logger.org.hibernate.tool.hbm2ddl=debug
{% endcodeblock %}

## 后记
不想写了，不堪回首。。。

最后贴个[项目代码](/upload/EmployeeTest.rar)，以儆效尤~不过要运行的话，肯定要有MySQL，还要建特定的数据库，特定的表咯。。。

{% img /images/20121118.png%}