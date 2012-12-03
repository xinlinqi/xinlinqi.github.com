---
layout: post
title: "Java 大作业中遇到的种种问题。"
date: 2012-11-03 17:04
comments: true
categories: [Java, Programming]
---

这篇博文算是一个问题集，希望能把所有在Java大作业中遇到的问题，以及解决方法都记下来。
就这么开始吧。

* ##1、首先是中文编码问题，把我虐得死去活来，不堪回首。
Java其实已经提供了很好的中文支持，但是现在还是出现乱码，这只能说是我的RP问题了。。。
首先放一段代码：

{% codeblock lang:java%}
package edu.sysu.ss.bms;
import java.io.*;
public class Test {
	public static void main(String args[]) throws Exception {
		BufferedReader mReader = new BufferedReader(new InputStreamReader(System.in));
		String something = mReader.readLine();
		System.out.println("It 's " + something);
	}
}
{% endcodeblock %}
这段代码很简单，就是从标准输入中读入一行字符串，然后输出，这个是支持中文的。但是到我手上运行的时候，当输入为中文时，输出是乱码。
这是为什么呢？肯定是编码问题，将代码文件的编码改为GBK之后，就可以了。
<!--more-->
然后程序中要做的是将读入的东西保存到XML中作持久化。这里又有问题，又放一段代码：

{% codeblock lang:java %}
	@Test
	public void testSaveUserData(){
		User pUser = new User();
		pUser.setTruename("圆神");
		XMLDataBase mBase = new XMLDataBase();
		mBase.saveUserData(pUser);

	}
{% endcodeblock %}
这样做的话需要将代码文件设为utf-8才能正常保存，如果编码格式为GBK，乱码。

最后一番折腾之后，将所有代码文件的编码都设为GBK，然后在用JAXB写XML的时候加这么一句

		this.userMarshaller.setProperty(Marshaller.JAXB_ENCODING, "GBK");

总算没错了。。。

* ## 2、java.util.ConcurrentModificationException
本科的时候虽然没有Java课程，但是我也自己断断续续学了一些，所以用Java编码应该有3年左右了。但还是第一次遇到这个Exception。
凭空看着这些血色的字眼，自然是发现不了错误的原因的。于是去网上找了解决方法。
很简单，我是以ArrayList.remove(object)方式来删除的，这样会报上面这个错误；然后只要用ArrayList.remove(index)就没事；

不求甚解。更何况正在赶作业中。
