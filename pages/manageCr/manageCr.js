//获取应用实例
var app = getApp();
var Server = app.globalData.server;
var selInfoCrServer = Server + "toDBDemo/AdminAction/SelInfoCr";
var selCrServer = Server + "toDBDemo/AdminAction/SelCr";
var updCrServer = Server + "toDBDemo/AdminAction/UpdCr";
var addCrServer = Server + "toDBDemo/AdminAction/AddCr";
var delCrServer = Server + "toDBDemo/AdminAction/DelCr";

Page({
  data: {
    crName: '',
    crPhone: '',
    crTeam: '',
    butName: '',
    butPhone: '',
    hiddenTxt: true,

    hiddenPicker: true,
    //可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框
    hiddenmodalAdd: true,
    hiddenmodalDel: true,
    hiddenmodalUpd: true,

    teamCodes: ["九院本部A4队", "九院本部A7队", "九院本部B9队"],
    teamCodeIndex: 1,

    grids: [{
      img: '../../images/add.png',
      name: '增加橙人',
      modal: 'modalAdd',
    }, {
      img: '../../images/delete.png',
      name: '删除橙人',
      modal: 'modalDel',
    }, {
      img: '../../images/update.png',
      name: '查询更改',
      modal: 'modalUpd',
    }]
  },

  onLoad: function(e) {
    var that = this;
    this.setData({
      crTeam: e.team, //设置crTeam为上一页面传过来的team
    });
    //动态设置导航标题
    if (e.team == "all") {
      wx.setNavigationBarTitle({
        title: '欢迎您~超级管理员',
      })
      var hiddenPicker = this.data.hiddenPicker;
      that.setData({
        hiddenPicker: !hiddenPicker,
      })
    }
    if (e.team == "a4") {
      wx.setNavigationBarTitle({
        title: '欢迎您~A4橙人管理员',
      })
    }
    if (e.team == "a7") {
      wx.setNavigationBarTitle({
        title: '欢迎您~A7橙人管理员',
      })
    }
    if (e.team == "b9") {
      wx.setNavigationBarTitle({
        title: '欢迎您~B9橙人管理员',
      })
    }
  },

  bindTeamCodeChange: function(e) {
    console.log('picker team code 发生选择改变，携带值为', e.detail.value);
    this.setData({
      teamCodeIndex: e.detail.value,
    })
    //动态设置超级管理员操作哪个队伍
    switch (e.detail.value) {
      case "0":
        this.setData({
          crTeam: "a4",
        });
        break;
      case "1":
        this.setData({
          crTeam: "a7",
        });
        break;
      case "2":
        this.setData({
          crTeam: "b9",
        });
        break;
    }
  },

  updateName: function(e) {
    var updataName = e.detail.value;
    this.setData({
      crName: updataName
    }); //把获取到的密码赋值给date中的password    
  },
  updatePhone: function(e) {
    var updataPhone = e.detail.value;
    this.setData({
      crPhone: updataPhone
    }); //把获取到的密码赋值给date中的password  
  },
  updateButName: function (e) {
    var updataButName = e.detail.value;
    this.setData({
      butName: updataButName
    });
  },
  updateButPhone: function (e) {
    var updateButPhone = e.detail.value;
    this.setData({
      butPhone: updateButPhone
    });
  },

  //点击按钮弹出指定的hiddenmodalAdd弹出框
  modalAdd: function(e) {
    this.setData({
      hiddenmodalAdd: !this.data.hiddenmodalAdd //隐藏模态输入框
    })
  },
  modalDel: function() {
    this.setData({
      hiddenmodalDel: !this.data.hiddenmodalDel
    })
  },
  modalUpd: function() {
    this.setData({
      hiddenmodalUpd: !this.data.hiddenmodalUpd
    })
  },

  //取消按钮
  cancel: function() {
    this.setData({
      hiddenmodalAdd: true,
      hiddenmodalDel: true,
      hiddenmodalUpd: true,
    });
  },
  //增加
  confirmAdd: function(e) {
    if (this.data.crName == '' || this.data.crPhone == '') {
      wx.showToast({
        title: '姓名或电话不能为空',
        icon: 'none'
      })
      return;
    }
    var that = this;
    wx.request({
      url: selCrServer,
      //定义传到后台的数据
      data: {
        //从全局变量data中获取数据
        crPhone: this.data.crPhone,
        crName: this.data.crName,
        crTeam: this.data.crTeam,
      },
      method: 'get', //定义传到后台接受的是post方法还是get方法
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log("后台传回的conCr信息" + res.data.conCr);
        if (res.data.conCr == "isCon") {
          wx.showToast({
            title: '已存在此橙人',
            icon: 'none'
          })
        } else {
          wx.request({
            url: addCrServer,
            //定义传到后台的数据
            data: {
              //从全局变量data中获取数据
              crName: that.data.crName,
              crPhone: that.data.crPhone,
              crTeam: that.data.crTeam,
            },
            method: 'post', //定义传到后台接受的是post方法还是get方法
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
              that.setData({
                hiddenmodalAdd: true,
              })
              console.log("后台传回的add信息" + res.data.isAdd);
              if (res.data.isAdd == "ok") {
                wx.showToast({
                  title: '增加成功',
                })
              } else {
                wx.showToast({
                  title: '增加失败~请重新登录管理员重试',
                  icon: 'none'
                })
              }
            },
            fail: function(res) {
              console.log("调用API失败");
            }
          })
        }
      },
      fail: function(res) {
        console.log("调用API失败");
      }
    })
  },

  //删除橙人
  confirmDel: function(e) {
    if (this.data.crPhone == '') {
      wx.showToast({
        title: '电话不能为空',
        icon: 'none'
      })
      return;
    }
    var that = this;
    wx.request({
      url: selCrServer,
      //定义传到后台的数据
      data: {
        //从全局变量data中获取数据
        crPhone: this.data.crPhone,
        crName: this.data.crName,
        crTeam: this.data.crTeam,
      },
      method: 'get', //定义传到后台接受的是post方法还是get方法
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log("后台传回的conCr信息" + res.data.conCr);
        if (res.data.conCr == "isCon") {
          wx.request({
            url: delCrServer,
            //定义传到后台的数据
            data: {
              //从全局变量data中获取数据
              crPhone: that.data.crPhone,
              crTeam: that.data.crTeam,
            },
            method: 'post', //定义传到后台接受的是post方法还是get方法
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
              that.setData({
                hiddenmodalDel: true,
              })
              console.log("后台传回的add信息" + res.data.isDel);
              if (res.data.isDel == "ok") {
                wx.showToast({
                  title: '删除成功',
                })
              } else {
                wx.showToast({
                  title: '删除失败~请重新登录管理员重试',
                  icon: 'none'
                })
              }
            },
            fail: function(res) {
              console.log("调用API失败");
            }
          })
        } else {
          wx.showToast({
            title: '不存在此橙人，无需删除',
            icon: 'none'
          })
        }
      },
      fail: function(res) {
        console.log("调用API失败");
      }
    })
  },

  //查询更改
  confirmUpd: function(e) {
    var that = this;
    if (this.data.crPhone == '') {
      wx.showToast({
        title: '电话不能为空',
        icon: 'none'
      })
      return;
    }
    wx.request({
      url: selInfoCrServer,
      //定义传到后台的数据
      data: {
        //从全局变量data中获取数据
        crPhone: this.data.crPhone,
        crTeam: this.data.crTeam,
      },
      method: 'post', //定义传到后台接受的是post方法还是get方法
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        console.log("调用API成功");
        console.log("后台传回的select信息" + res.data.conInfoCr);
        if (res.data.conInfoCr == "isCon") {
          wx.showToast({
            title: '查询到此橙人',
          })
          that.setData({
            hiddenTxt: false,
            crName: res.data.crName,
            crPhone: res.data.crPhone,
          })
        } else {
          wx.showToast({
            title: '未查到此橙人',
            icon: 'none'
          })
          that.setData({
            hiddenTxt: true,
          })
        }
      },
      fail: function(res) {
        console.log("调用API失败");
      }
    })
  },

  confirmBut:function(e){
    var that = this;
    if (this.data.butName == '' || this.data.butPhone == '') {
      wx.showToast({
        title: '姓名或电话不能为空',
        icon: 'none'
      })
      return;
    }
    wx.request({
      url: updCrServer,
      //定义传到后台的数据
      data: {
        //从全局变量data中获取数据
        crPhone: this.data.crPhone,
        crTeam: this.data.crTeam,
        butName: this.data.butName,
        butPhone: this.data.butPhone,
      },
      method: 'post', //定义传到后台接受的是post方法还是get方法
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log("调用API成功");
        console.log("后台传回的update信息" + res.data.isUpd);
        if (res.data.isUpd == "ok") {
          that.setData({
            hiddenmodalUpd: true,
          })
          wx.showToast({
            title: '更改成功',
          })
        } else {
          wx.showToast({
            title: '更改失败',
            icon: 'none'
          })
        }
      },
      fail: function (res) {
        console.log("调用API失败");
      }
    })
  }

});