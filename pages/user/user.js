//user.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    imageList: [
      'https://gitee.com/kevin_tao/CRJD/raw/master/ydxcx.png',
      'https://gitee.com/kevin_tao/CRJD/raw/master/wxcode.jpg',
      'https://gitee.com/kevin_tao/CRJD/raw/master/wxqCode.png'
    ],
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    var that = this
    var scene_img = '' //这里添加图片的地址
    that.setData({
      scene: scene_img
    })

  },

  //进入显示圆周动画。但是点击图片回来后会卡托
  // onShow: function () {
  //   var i = 0
  //   var dotAnData = wx.createAnimation({
  //     duration: 200,
  //     transformOrigin: '4px 91px'
  //   })

  //   var dotAnFun = setInterval(function () {
  //     dotAnData.rotate(6 * (++i)).step()
  //     this.setData({
  //       dotAnData: dotAnData.export()
  //     })
  //   }.bind(this), 200)
  // },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  imageClick: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.imageList // 需要预览的图片http链接列表
    });
  },
})
