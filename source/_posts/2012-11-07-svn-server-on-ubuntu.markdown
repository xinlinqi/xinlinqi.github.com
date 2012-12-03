---
layout: post
title: "在Ubuntu上安装SVN服务器"
date: 2012-11-07 20:26
comments: true
categories: Ubuntu SVN
---
##缘起
上学期由于在基地那边值班，利用职务之便，在基地的某台电脑上搭建了一个SVN服务器。在Windows下，SVN服务器搭建很方便，只需要下载VisualSVN，图形化界面，操作很简单。就这样在上面搭了很多东西，但是这学期由于基地的活越来越少，我也由于学业压力，没有在那边上班，那台机器被关掉了。我也不好意思去向那边的人说，唉，那台机器是我要用的耶，开一下吧。。。

##正文
幸亏在基地工作的两个月我赚到了一台服务器，完全独立管理权限哈哈~不过系统是Ubuntu的。
今晚花了两个多小时配好了SVN服务器，激动之余，Post一篇博文上来，记一下。

* 安装subversion，apache2

由于这台服务器上原来就有apache2，所以省了。
		sudo apt-get install apache2 subversion libapache2-svn
<!--more-->
其中第三个东西是最重要的，也是卡我时间最长的。譬如出现`Unknown DAV provider:svn`，`Invalid command 'DAV'`等等神奇的错误大都是因为没有装这个东西。

* 配置

最主要的配置就是dav_svn.conf了，安装好libapache2-svn后会出现在/etc/apache2/mods-available文件夹下。
{% codeblock %}
<Location /svn>
	DAV svn
	SVNParentPath /home/svn
	AuthType Basic
	AuthName "Subversion Repository"
	AuthUserFile /etc/subversion/passwd
	#<LimitExcept GET PROPFIND OPTIONS REPORT>
	Require valid-user
	#</LimitExcept>
</Location>
{% endcodeblock%}
这个是我的配置，当然是参考了网上的配置方法。

* 用户管理

然后要做的是在系统用户和组中建立一个subversion组，将www-data(apache用户)和当前系统登录用户加入到这个组中。
命令如下：
		sudo addgroup subversion
		sudo usermod -G subversion -a www-data
如果一切正常，结果应该是这样子的：
		$ cat /etc/group|grep subversion
		subversion:x:1001:www-data,exp

* 建库

首先选定一个文件夹作为你的SVN根目录。
		$ sudo mkdir /home/svn
		$ cd /home/svn
		$ sudo mkdir bms
		$ sudo chown -R www-data:subversion bms
其中bms是我的一个SVN库的名字

初始化库：
		$ sudo svnadmin create /home/svn/bms

* 权限设置

以为这样就搞定了？真是的，怎么可能这么快？

首先查看txn-current-lock文件的权限信息：
		$ ls -l /home/svn/myproject/db/txn-current-lock
		-rw-r--r-- 1 www-data subversion  0  2012-11-7  20:33  txn-current-lock
如果这样的话就好了，不然的话执行下面命令：
		$ sudo chown -R www-data:subversion bms

然后，好像就没什么了。

关于SVN用户管理去网上搜吧，我现在也没有研究，只是加了一个用户。

然后重启一下Apache就好了
		sudo /etc/init.d/apache2 restart
最后的最后，就放一张图吧~

{%img /images/20121107.png%}
		
好吧，再放一张。。。

{%img /images/20121107_1.jpg%}
