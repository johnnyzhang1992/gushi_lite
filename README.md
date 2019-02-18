# 古诗文小助手（微信小程序）

这个是[学古诗](https://xuegushi.cn) 网站的微信小程序。
通过小程序可以更方便简洁的学习中国传统古诗文，希望能对大家有所帮助。

## 样式
使用微信官方的[WeUi](https://weui.io)

## 搜索部分
搜索部分是在[天未](https://github.com/mindawei)的[wsSearchView](https://github.com/mindawei/wsSearchView)的基础上进行的改造和优化。

## 注意事项
- 请求返回的收据尽量简洁
- 使用定时器时，当退出当前页面时应该注销（onHide,onUnload）
- 没有在 wxml 里面使用到的数据尽量不要放到 page.data 里面

## 小程序二维码

![古诗文小助手](https://github.com/johnnyzhang1992/gushi_lite/blob/master/images/xcx.jpg)

## 声明

最近在微信发现有同学把上面的代码稍微修改然后打包发布了，而且还贴满了广告。。。(小程序：快乐古诗文

既然上传到 GitHub ，说明是希望大家相互学习但是你直接抄袭然后拿去赚钱，还直接用的网站 API，这过分了哈！

最后重申，代码可以用来学习使用是不介意的，网站 api 做测试使用也是不介意的，但是如果做正式发布使用，是介意的。
