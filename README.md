# 古诗文小助手（微信小程序）

#### [阿里云折扣优惠券](https://promotion.aliyun.com/ntms/yunparter/invite.html?userCode=rk77qloy)
![阿里云折扣优惠券](https://images.gitee.com/uploads/images/2019/0109/114755_88127e0f_744475.jpeg "1000_90.jpg")

这个是[学古诗](https://xuegushi.com) 网站的微信小程序。

该小程序的目的是为了大家更方便简洁的学习中国传统古诗文，同时通过这些代码更多的学习使用小程序。

> 该项目为微信原生版本，[Taro 重构版](https://github.com/johnnyzhang1992/gushiTaro) 已上线,当前项目不再维护（2023-12-04）。

## 文件目录

- `apis`

  API 接口统一请求文件

- `component`

  此目录是自定义组件部分

- `images`

  此目录下是小程序所用的一些图标，可以的话可以改为雪碧图。

- `pages`

  此目录下为小程序主要内容，各页面 View 和 js 文件

- `style`

  样式表，使用微信官方的[WeUi](https://weui.io)

- `utils`

  自己封装的一些工具

- `wxSearchView`

  此目录为搜索部分的使用的搜索功能模块。

  搜索部分是在[天未](https://github.com/mindawei)的[wsSearchView](https://github.com/mindawei/wsSearchView)的基础上进行的改造和优化。

## 作者

👤 **johnnyzhang1992**

- Website: [johnnyzhang.cn](https://xuegushi.com)
- Github: [@johnnyzhang1992](https://github.com/johnnyzhang1992)

## Show your support

Give a ⭐️ if this project helped you!

## License

Copyright © 2019 [johnnyzhang1992](https://github.com/johnnyzhang1992).

---

## 注意事项

- API 请求返回的数据尽量简洁
- 使用定时器时，当退出当前页面时应该注销（onHide,onUnload）
- 没有在 wxml 里面使用到的数据尽量不要放到 page.data 里面

## API 使用指南

- API Get 类的方法可以正常使用，POST 类的请求需要用户 openid 不建议使用（例如：收藏以及个人中心相关接口。
- 用户创建失败的问题。创建用户的逻辑涉及后端解密(和项目的 appid 有关,不同的项目 appid 不同)，会导致解密失败，从而导致用户创建失败。

## 小程序二维码

![古诗文小助手](./images/xcx.jpg)
