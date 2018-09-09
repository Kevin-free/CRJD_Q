// pages/loginCr/loginCr.js
var app = getApp();
var server = app.globalData.server;

Page({
  data: {
    phone1: '15727546130',
    phone2: '14796765019',
    phone3: '13627077311',

    account: "",
    password: "",
    message: ""
  },

  //处理accountInput的触发事件
  accountInput: function (e) {
    var username = e.detail.value;//从页面获取到用户输入的用户名/邮箱/手机号
    if (username != '') {
      this.setData({ account: username });//把获取到的密码赋值给全局变量Date中的password
    }
  },
  //处理pwdBlurt的触发事件
  pwdBlur: function (e) {
    var pwd = e.detail.value;//从页面获取到用户输入的密码
    if (pwd != '') {
      this.setData({ password: pwd });//把获取到的密码赋值给全局变量Date中的password
    }
  },
  //处理login的触发事件
  login: function (e) {
    wx.request({
      url: server + "toDBDemo/AdminAction/Login",
      //定义传到后台的数据
      data: {
        //从全局变量data中获取数据
        account: this.data.account,
        password: this.data.password,
      },
      method: 'get',//定义传到后台接受的是post方法还是get方法
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data.isLogin);
        console.log(res.data.team);
        if (res.data.isLogin == "ok") {
          // wx.showToast({
          //   title: '登陆成功',
          // })
          switch (res.data.team) {
            case "all":
              wx.navigateTo({
                url: '../manageCr/manageCr?team=all',
              })
              break;
            case "a4":
              wx.navigateTo({
                url: '../manageCr/manageCr?team=a4',
              })
              break;
            case "a7":
              wx.navigateTo({
                url: '../manageCr/manageCr?team=a7',
              })
              break;
            case "b9":
              wx.navigateTo({
                url: '../manageCr/manageCr?team=b9',
              })
              break;
            default:              
              break;
          }
        }
        else {
          wx.showModal({
            title: '提示',
            content: '用户名或者密码错误',
            showCancel: false
          })
        }
      },
      fail: function (res) {
        console.log("调用API失败");
      }
    })
  },

  phonecallevent1: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.phone1,
    })
  },
  phonecallevent2: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.phone2,
    })
  },
  phonecallevent3: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.phone3,
    })
  },
})