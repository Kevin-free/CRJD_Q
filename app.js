//app.js
// var fakeVersion = "0"; //审核时的假版本号
App({
  onLaunch: function () {
    // var that = this;
    // var Server = this.globalData.server
    // wx.request({
    //   url: Server + "toDBDemo/AdminAction/ControlVer",
    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //     console.log("后台传回的version信息:" + res.data.ver);
    //     if (res.data.ver == fakeVersion) {
    //       that.globalData.isFake = true;
    //       console.log("show fakeView")
    //     } else {
    //       that.globalData.isFake = false;
    //       console.log("show realView")
    //     }
    //   }      
    // })

    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？\n-----更新如下-----\n1.完善橙人管理员功能 \n2.增加定时发送邮件功能 \n3.增加定时清空昨日数据 \n4.用户上传图片转至七牛云',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })

    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

  },
  globalData: {
    // isFake: true,
    userInfo: null,
    //localServer http://localhost:8080
    //myServer https://www.ifree258.club
    //yjServer https://www.black-milk.top
    server: 'https://www.ifree258.club/',
  }
})
