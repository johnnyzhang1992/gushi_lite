// pages/poem/detail/index.js
const app = getApp();
let until = require('../../../utils/util');
const canvas = require('../../../utils/canvas');
let authLogin = require('../../../utils/authLogin');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        user_id: 0,
        poem: null,
        detail: null,
        poems_count:0,
        content:null,
        tags:[],
        winHeight: "",//窗口高度
        currentTab: 0, //预设当前项的值
        scrollLeft: 0, //tab标题的滚动条位置
        tab_lists: null,
        collect_status: false,
        _audio: null,
        is_loading: true,
        animation: {},
        filePath: null,
        bg_image: null,
        codePath: null,
        pixelRatio: 1,
        canvas_img: null,
        is_show: 'visible',
        is_load: false,
        show_canvas: false
    },
    // 获取用户id
    getUserId: function(){
        let user = wx.getStorageSync('user');
        let user_id = user ? user.user_id: 0;
        this.setData({
            user_id: user_id
        });
    },
    // 返回启动页
    return: function () {
        wx.switchTab({
            url: '/pages/index/index'
        });
    },
    addNew: function () {
        let that = this;
        if (that.data.user_id < 1) {
            authLogin.authLogin('/pages/poem/detail/index?id='+that.data.poem.id,'nor',app);
        } else {
            wx.navigateTo({
                url: '/pages/find/new/index?type=poem&id='+that.data.poem.id
            })
        }
    },
    // 滚动切换标签样式
    switchTab: function (e) {
        this.setData({
            currentTab: e.detail.current
        });
        this.checkCor();
        this.changeTabContent(e.detail.current)
    },
    // 点击标题切换当前页时改变样式
    swichNav: function (e) {
        let cur = e.target.dataset.current;
        // console.log(cur);
        if (this.data.currentTaB == cur) { return false; }
        else {
            this.setData({
                currentTab: cur
            })
        }
        this.changeTabContent(cur)
    },
    // 根据tab改变刷新内容
    changeTabContent: function(cur){
        let that = this;
        let data = null;
        if(cur == 3){
            data = that.data.poem.background
        }else if (cur ==1){
            data = (that.data.detail && that.data.detail.yi) ? that.data.detail.yi.content : null
        }else if (cur == 0) {
            data = (that.data.detail && that.data.detail.zhu) ? that.data.detail.zhu.content: null;
            // for(let i = 0;i<data.length;i++){
            //   let _data = data[i].toString();
            //   data[i] = [_data.substr(0,_data.indexOf("：")),_data.substr(_data.indexOf("：")+1,_data.length)];
            // }
        }else if (cur == 2) {
            data = (that.data.detail && that.data.detail.shangxi) ? that.data.detail.shangxi.content:null
        }else if(cur == 4){
            data = that.data.detail.more_infos ? that.data.detail.more_infos.content : []
        }
        that.setData({
            tab_lists: data
        })
    },
    //判断当前滚动超过一屏时，设置tab标题滚动条。
    checkCor: function () {
        if (this.data.currentTab > 4) {
            this.setData({
                scrollLeft: 300
            })
        } else {
            this.setData({
                scrollLeft: 0
            })
        }
    },
    // 跳转到音频页面
    audio: function(){
        wx.navigateTo({
            url: '/pages/poem/audio/index?id='+this.data.poem.id+'&title='+this.data.poem.title,
        })
        
    },
    // 跳转到音频页面
    copy: function(){
        let poem = this.data.poem;
        let _data = '《'+poem.title+'》'+poem.dynasty+'|'+poem.author+'\n'+poem.text_content;
        wx.setClipboardData({
            data: _data,
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) {
                        wx.showToast({
                            title: '诗词复制成功',
                            icon: 'success',
                            duration: 2000
                        })
                    }
                })
            }
        })
    },
    // 渲染tagList
    renderTagList: function () {
        let _detail = this.data.detail;
        if (_detail && _detail.yi) {
            _detail.yi = JSON.parse(_detail.yi)
        }
        if (_detail && _detail.zhu) {
            _detail.zhu = JSON.parse(_detail.zhu)
        }
        if (_detail && _detail.shangxi) {
            _detail.shangxi = JSON.parse(_detail.shangxi)
        }
        if (_detail && _detail.more_infos) {
            _detail.more_infos = JSON.parse(_detail.more_infos)
        }
        this.setData({
            detail: _detail,
            tab_lists: (_detail && _detail.zhu) ? _detail.zhu.content : null,
        })
    },
    // 获取诗词详情
    getPoemDetail: function(poem_id,user_id){
        let that = this;
        return new Promise((resolve,reject)=> { //结果以Promise形式返回
            wx.request({
                url: 'https://xuegushi.cn/wxxcx/poem/'+poem_id+'?user_id='+user_id,
                success: res => {
                    if (res.data) {
                        console.log('----------success------------');
                        console.log(res.data);
                        let _detail = res.data.detail;
                        that.setData({
                            poem: res.data.poem,
                            detail: _detail,
                            poems_count: res.data.poems_count,
                            content:JSON.parse(res.data.poem.content),
                            tags: (res.data.poem.tags && res.data.poem.tags !='') ? res.data.poem.tags.split(',') : [],
                            // tab_lists: (_detail && _detail.zhu) ? _detail.zhu.content : null,
                            collect_status: res.data.poem.collect_status,
                            bg_image: res.data.bg_image,
                            is_loading: false
                        });
                        resolve(Object.assign(res.data, {succeeded: true})); //成功失败都resolve，并通过succeeded字段区分
                    }else{
                        resolve(Object.assign(res, {succeeded: false})); //成功失败都resolve，并通过succeeded字段区分
                    }
                },
                fail:error=>{
                    resolve(Object.assign(error, {succeeded: false})); //成功失败都resolve，并通过succeeded字段区分
                }
            });
        });
    },

    // context.font="italic small-caps bold 12px arial";
    // canvas 画图
    drawImage: function(file_path){
        let that = this;
        let content = that.data.content.content;
        let pixelRatio = that.data.pixelRatio;
        let winWidth = that.data.winWidth;
        let winHeight = that.data.winHeight;
        let filePath = file_path ? file_path : that.data.filePath;
        let date = until.formatDate();
        const ctx = wx.createCanvasContext('myCanvas');
        // 全局设置
        // ctx.setGlobalAlpha(0.8);
        let font_size = 18*pixelRatio+'px';
        ctx.font="normal normal normal "+font_size+" Microsoft YaHei";
        // 背景图
        ctx.drawImage(filePath, 0, 0,winWidth * pixelRatio, winHeight * pixelRatio);
        // 左上角文字框
        canvas.drawRect(ctx,20 * pixelRatio, 0, 80 * pixelRatio, 50 * pixelRatio,'rgba(0,0,0,0.4)');
        // 日期
        font_size = 16*pixelRatio+'px';
        canvas.drawText(ctx,date[0],60 * pixelRatio,20 * pixelRatio,'center','#fff',60*pixelRatio,'normal normal normal '+font_size+' sans-serif');
        canvas.drawText(ctx,date[1]+'/'+date[2],60 * pixelRatio,40 * pixelRatio,'center','#fff',60*pixelRatio,'normal normal normal '+font_size+' sans-serif');
        // 正文
        let result = [];
        font_size = 14*pixelRatio+'px';
        console.log('normal normal normal '+font_size+' "Microsoft YaHei""');
        content.forEach((item,index)=>{
            result.push(canvas.breakLinesForCanvas(ctx,item,(winWidth-80)*pixelRatio,'normal normal normal '+font_size+' sans-serif'))
        });
        // 诗词内容
        let text_y = 40+20+15;
        let line_number = 0;
        result.forEach((item)=>{
            if(line_number<13){
                item.map((_item)=>{
                    line_number = line_number+1;
                    text_y = text_y+17;
                });
                text_y = text_y+6;
            }
        });
        // 底部白框
        canvas.drawRect(ctx,0, (winHeight-145-text_y/2) * pixelRatio, winWidth * pixelRatio, winHeight * pixelRatio,'rgba(255,255,255,0.8)');
        // 正文框
        canvas.drawRect(ctx,20 * pixelRatio, (winHeight-140-text_y) * pixelRatio, (winWidth-40) * pixelRatio, (text_y) * pixelRatio,'rgba(255,255,255,0.9)');
        // 标题
        font_size = 18*pixelRatio+'px';
        canvas.drawText(ctx,'《'+that.data.poem.title+'》',winWidth * pixelRatio/2,(winHeight-110-text_y)*pixelRatio,'center',
            '#333',(winWidth-80)*pixelRatio,'normal normal bold '+font_size+' sans-serif');
        // 作者
        font_size = 14*pixelRatio+'px';
        let author = that.data.poem.author + ' | ' + that.data.poem.dynasty;
        canvas.drawText(ctx,author,winWidth * pixelRatio/2,(winHeight-85-text_y)*pixelRatio,'center',
            '#808080',(winWidth-90)*pixelRatio,'normal normal bold '+font_size+' sans-serif');
        // 古诗词正文
        line_number = 0;
        result.forEach((item)=>{
            if(line_number<13){
                item.forEach((_item,index)=>{
                    line_number = line_number+1;
                    if(index<item.length-1 || item.length<2){
                        canvas.drawText(ctx,_item,(winWidth/2) * pixelRatio,(winHeight-60-text_y)*pixelRatio,'center', '#808080',(winWidth-80)*pixelRatio,'normal normal bold '+font_size+' sans-serif');
                    }else{
                        canvas.drawText(ctx,_item,40 * pixelRatio,(winHeight-60-text_y)*pixelRatio,'left', '#808080',(winWidth-80)*pixelRatio,'normal normal bold '+font_size+' sans-serif');
                    }
                    text_y = text_y-16;
                });
                text_y = text_y -5
            }
        });
        // 二维码左侧文字
        ctx.setFontSize(15*pixelRatio);
        ctx.setFillStyle('#333');
        ctx.setTextAlign('center');
        ctx.fillText("更多古诗词内容",(winWidth-130)/2*pixelRatio,(winHeight-55)*pixelRatio);
        ctx.fillText("长按二维码进入",(winWidth-130)/2*pixelRatio,(winHeight-35)*pixelRatio);
        // 二维码
        let codePath = that.data.codePath ? that.data.codePath : '/images/xcx1.jpg';
        let img_width = 30;
        let img_x = winWidth-135;
        let img_y = winHeight -80;
        canvas.drawCircleImage(ctx,(img_width+5) * pixelRatio,img_width*2 * pixelRatio,(img_x + 30) * pixelRatio,
            (img_y + 30) * pixelRatio,img_x * pixelRatio, img_y * pixelRatio,codePath);
        ctx.draw(true,()=>{
            console.log('画图结束，生成临时图...');
            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: winWidth * pixelRatio,
                height: winHeight * pixelRatio,
                destWidth: winWidth*2,
                destHeight: winHeight*2,
                canvasId: 'myCanvas',
                success(res) {
                    console.log(res);
                    that.setData({
                        is_show: 'hidden',
                        show_canvas: 'visible',
                        canvas_img: res.tempFilePath,
                        is_load: true
                    });
                    wx.hideLoading();
                    console.log(res.tempFilePath)
                }
            });
        })
    },
    // canvas 生成临时图
    canvasToImage: function(){
        console.log('---click---me');
        let that = this;
        that.setData({
            show_canvas: true
        });
        if(!that.data.canvas_img){
            wx.showLoading({
                title: '图片生成中...',
            });
            until.downImage(that.data.bg_image,).then(res=>{
                console.log('背景图片下载完成---');
                if(res && res.succeeded){
                    that.setData({
                        file_path: res.tempFilePath
                    });
                    console.log('canvas 画图中...');
                    that.drawImage(res.tempFilePath);
            
                }
            });
        }
    },
    // 保存图片到本地
    saveImage: function(){
        let that = this;
        let file_path = this.data.canvas_img;
        wx.showLoading({
            title: '正在保存图片...',
        });
        wx.saveImageToPhotosAlbum({
            filePath: file_path,
            success(res) {
                console.log(res);
                console.log('图片保存完成');
                wx.hideLoading();
                wx.showToast({
                    title: '保存成功，现在去分享吧！',
                    icon: 'none',
                    duration: 2000
                });
                setTimeout(()=>{
                    that.setData({
                        show_canvas: false
                    })
                },2000)
            }
        });
    },
    notSaveImage: function(){
        this.setData({
            show_canvas: false
        })
    },
    // 获取小程序码
    getCodeImage: function(type,id){
        let that = this;
        let _type = type ? type : 'poem';
        let path = '';
        if(_type == 'poem'){
            path = '/pages/poem/detail/index?id='+id;
        }
        wx.request({
            url: app.globalData.url+'/wxxcx/getWXACode/',
            data: {
                type: type,
                target_id: id,
                path: path,
                width: 300
            },
            success: res => {
                if (res.data) {
                    console.log('----------success------------');
                    // console.log(res.data);
                    until.downImage(res.data.file_name).then(res1=>{
                        console.log(res1);
                        if(res1 && res1.succeeded){
                            that.setData({
                                codePath: res1.tempFilePath
                            });
                        }
                    })
                }
            },
            fail:error=>{
                console.log(error)
            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        wx.showLoading({
            title: '页面加载中...',
            mask: true
        });
        this.getUserId();
        //  高度自适应
        wx.getSystemInfo({
            success: function (res) {
                let clientHeight = res.windowHeight,
                    clientWidth = res.windowWidth,
                    rpxR = 750 / clientWidth;
                let calc = clientHeight * rpxR - 180;
                // console.log(calc)
                that.setData({
                    winHeight1: calc,
                    pixelRatio: res.pixelRatio,
                    winHeight: clientHeight,
                    winWidth: clientWidth
                });
            }
        });
        that.getPoemDetail(options.id,that.data.user_id).then((res)=>{
            if(res && res.succeeded){
                wx.hideLoading();
                that.renderTagList();
                that.getCodeImage('poem',options.id);
            }
        });
    },
    // 更新收藏情况
    updateCollect: function () {
        let that = this;
        if(that.data.user_id<1){
            // https.userLogin(that.data.poem.id);
            authLogin.authLogin('/pages/poem/detail/index?id='+that.data.poem.id,'nor',app);
        }else{
            wx.request({
                url: 'https://xuegushi.cn/wxxcx/' + that.data.poem.id + '/collect/poem?user_id=' + that.data.user_id + '&wx_token=' + wx.getStorageSync('wx_token'),
                success: res => {
                    if(res.data){
                        that.setData({
                            collect_status: res.data.status
                        })
                    }else{
                        that.setData({
                            collect_status: res.data.status
                        })
                    }
                }
            })
        }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        wx.hideLoading();
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let animation = wx.createAnimation({
            transformOrigin: "50% 50%",
            duration: 500,
            timingFunction: "ease",
            delay: 0
        });
        animation.scale(1.3, 1.3).step();
        this.setData({
            animationData: animation.export()
        });
        setTimeout(function () {
            animation.scale(1, 1).step();
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 500)
    },
    
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
    
    },
    
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
    
    },
    
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        wx.showLoading({
            title: '刷新中...',
            mask: true
        });
        let that = this;
        this.getUserId();
        that.setData({
            is_loading: true
        });
        that.getPoemDetail(that.data.poem.id,that.data.user_id).then((res)=>{
            if(res && res.succeeded){
                wx.hideLoading();
                wx.stopPullDownRefresh();
                this.renderTagList();
            }
        });
    },
    
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
    
    },
    
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        let that = this;
        return {
            title: that.data.poem.title,
            path: '/pages/poem/detail/index?id='+that.data.poem.id,
            // imageUrl:'/images/poem.png',
            success: function(res) {
                // 转发成功
                console.log('转发成功！')
            },
            fail: function(res) {
                // 转发失败
            }
        }
    }
});