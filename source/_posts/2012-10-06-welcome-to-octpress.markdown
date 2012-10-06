---
layout: post
title: "octpress 基本上搭建完成了!!!"
date: 2012-10-06 15:02
comments: true
categories: life
---

经过一个上午的奋战，我终于在Github上搭建了自己的博客。

最开始的时候是参考了[jekyll博客引擎的搭建](http://blog.leezhong.com/tech/2010/08/25/make-github-as-blog-engine.html)，在Github上弄了一个jeklly Demo。

完成的时候很兴奋，也很新奇，感觉Github真的太强大了！我之前一直以为Github只是一个和SVN差不多的代码管理工具，只是对代码文件进行管理，没想到他还能扮演一个类似服务器的角色！

以下来记录一下我的建博历程以及遇到的问题及解决方法。

{% img /images/qb_1.jpg %}
<!-- more -->

##建立Github Page

当我们访问username.github.com的时候，Github会返回一个404错误，但是注意往下看，会发现有个指向建立Github Page文档的链接。

 {% img /images/github_404_page.png %}
 
 具体方法很简单，只要建立一个以`usernmae.github.com`（例如`xinlinqi.github.com`）的库，然后在根目录下放一个`index.html`文件即可访问

##搭建Octpress本地环境

从某方面来说，大牛们可能会鄙视我，因为我是个windows的死忠。在一些大牛眼中，windows就是个渣渣，如果一个程序员不用Linux，不用vi，就是一辈子都是水货的货。其实，我是打心里敬佩使用Linux的大牛们。不扯蛋了，反正我接下来都是在Windows基础上来说的。

* 安装ruby。可以进入[RubyForge](http://rubyforge.org/frs/?group_id=167)进行下载，我下载的是[rubyinstaller-1.9.3-p194.exe](http://rubyforge.org/frs/download.php/76054/rubyinstaller-1.9.3-p194.exe)。

* 安装gem编译环境。下载地址：[DevKit-tdm-32-4.5.2-20111229-1559-sfx.exe](https://github.com/downloads/oneclick/rubyinstaller/DevKit-tdm-32-4.5.2-20111229-1559-sfx.exe)，其实这是个7z压缩文件，解压到一个目录，然后执行下述操作。

		cd F:\DevKit
		ruby dk.rb init
		ruby dk.rb instal
 
* 安装Git。[下载地址](https://help.github.com/articles/set-up-git)

* 安装rdoc和bundle

		gem install rdoc bundler

## 其他准备

* 由于国内网络原因（大家懂的~），Ruby更新源一直不稳定，在执行`gem install ***`的时候可能会半天没响应。解决方法就是用淘宝提供的更新源。方法如下

		gem source -r http://rubygems.org/
		gem source -a http://ruby.taobao.org
		
由于接下来还会用到bundle，还得修改Gemfile文件

		source 'http://ruby.taobao.org'

* 在Windows底下有些乱码问题让人纠结到死，譬如我在这次安装过程中，就遇到一些乱码问题，比如markdown文件中加入中文的话,`rake generate`的时候会出错。

具体解决方法是首先在系统环境变量中加入LANG和LC_ALL，如下图所示：

{% img /images/lang_lc_all.png %}

然后在编辑markdown文件的时候注意将编码调为utf-8 无BOM格式。（这些都是后话啦，好像有点乱序了。。）

## 安装Octpress

* 下载Octpress源码

		git clone git://github.com/imathis/octopress.git octopress
		
* 安装依赖模块

		$ bundle install

* 安装，此刻安装的是默认主题。

		$ rake install
		
## 将Octpress发布到Github

* 第一次发布的时候需要与Github建立连接。

		rake setup_github_pages
		按照提示输入url地址，例如：git@github.com:xinlinqi/xinlinqi.github.com.git
		
* 生成静态页面、发布

		rake generate
		rake deploy
		
如果需要本地查看效果的话，执行

		rake preview
即可通过访问[http://localhost:4000](http://localhost:4000)进行查看

* 如果你想将自己的博客配置源代码分享给其他人的话，可以上传

		git add .
		git commit -m "open source"
		git push orign source
		
即可在Github上建立一个Source Branch用来保存你的源码。

## 其他的一些配置，`_config.yml`文件。

* 增加评论。Octpress中内置了Disqus作为其评论插件，使用也很简单。只需改以下参数，唯一要注意的是disqus_short_name不是你的注册用户名！

		disqus_short_name: xinlinqisblog
		disqus_show_comment_count: true

* 修改博客的基本信息。

		url: http://xinlinqi.github.com
		title: Mr.Driver
		subtitle: A blogging framework for hackers.
		author: xinlinqi
		simple_search: http://google.com/search
		description:

最后，总算搭建好了一个博客，其实我之前已经有了一个在新浪SAE上的[博客](http://xinlinqi.sinaapp.com)了，只是没有怎么用，现在搭建了一个，也许也不会怎么用。。囧~算了，还是写些东西，记录下生活的点点滴滴吧！

## 参考文献 O.O

* [http://octopress.org/docs/blogging/](http://octopress.org/docs/blogging/)
* [http://www.cnblogs.com/rubylouvre/archive/2012/06/10/2543706.html](http://www.cnblogs.com/rubylouvre/archive/2012/06/10/2543706.html)
* [http://zespia.tw/blog/2012/01/25/slash-theme/](http://zespia.tw/blog/2012/01/25/slash-theme/)
* 还有其他已经被我关掉的、已经在天国的标签页。