# convertNetDocToEBook
1. 根据抓取的首页分析出右边菜单栏内容获得相关链接，组织好目录结构，然后循环抓取。    
2. 待全部下载完毕开始PDF转化

# TODO
1. html转PDF已完成，但是大小貌似有问题，估计需要调整参数；
2. 在对url list中的链接进行下载的过程中有些可能失败，此时应该个字段标识是否抓取成功，并设置定时器循环抓取直到全部被加载完成；
3. 在保存pdf之前，应该是能够对dom进行modify的，可以改变render之后的样式，但是没在phantomjs中找到合适的接口；
4. 没有合并PDF，并对应的生成目录

# 难点
PDF中的目录还没想好怎么搞

# 环境
1. 在window下 jsom 始终安装不成功，貌似是VCBuild的问题；
2. 在mac下 phantomjs 我没跑起来，囧；
3. 最后在 ubuntu 中运行通过， phantomjs 是进行[编译](http://phantomjs.org/build.html)的，貌似API什么的在网上找不到，囧。
