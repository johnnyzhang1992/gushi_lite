# 古诗文小助手（微信小程序）

这个是[学古诗](https://xuegushi.cn) 网站的微信小程序。

该小程序的目的是为了大家更方便简洁的学习中国传统古诗文，同时通过这些代码更多的学习使用小程序。

## 文件目录

- `apis`

    API接口统一请求文件
- `component`

    此目录是自定义组件部分
- `images`

    此目录下是小程序所用的一些图标，可以的话可以改为雪碧图。
- `pages`

    此目录下为小程序主要内容，各页面View 和 js 文件
- `style`

    样式表，使用微信官方的[WeUi](https://weui.io)
- `utils`

    自己封装的一些工具
- `wxSearchView`

    此目录为搜索部分的使用的搜索功能模块。

    搜索部分是在[天未](https://github.com/mindawei)的[wsSearchView](https://github.com/mindawei/wsSearchView)的基础上进行的改造和优化。

## 注意事项

- 请求返回的收据尽量简洁
- 使用定时器时，当退出当前页面时应该注销（onHide,onUnload）
- 没有在 wxml 里面使用到的数据尽量不要放到 page.data 里面

## 小程序二维码

![古诗文小助手](./images/xcx.jpg)
