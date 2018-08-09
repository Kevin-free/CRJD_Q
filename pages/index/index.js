import WxValidate from '../../assets/plugins/wx-validate/WxValidate' //引入第三方验证信息库

var util = require('../../utils/util.js');
//var e, n, s = require("../../libs/qqmap-wx-jssdk.js");

//获取应用实例
var app = getApp();
var testServer = 'http://203.195.232.77:8080/'; //myServer 203.195.232.77
var server = 'http://203.195.232.77:8080/toDBDemo/UserAction/Insert';

Page({
  data: {
    phoneNum: '14796765019',

    form: {
      userName: '',
      userPhone: '',
      userPassword: '',
      item: '',
      room: '',
      addTxt: '',
      myPhone: '',
      team: '',
      myMail: '',
      dcmy: '',
    },

    allItems: [
      {
        ywlx: '存送话费及预约办卡',
        ywsm: '交100元最高得300.50立即到账.赠送的话费按照每月消费的百分百进行划拨.第六个月返还50本金.具体看网龄长短（一年以下的200.1-2年以下得250.两年以上300得300.）合约期6个月',
        value: '0',
        check: false,
        hidden: true,
        tareahidden: true
      },
      {
        ywlx: '低消38元每月20M宽带',
        ywsm: '每月承诺最低消费38元即送价值200元的校园\n20M宽带\n合约期1年\n未达到最低消费系统将自动收取38元',
        value: '1',
        check: false,
        hidden: true,
        tareahidden: true
      },
      {
        ywlx: '低消48元每月50M宽带',
        ywsm: '每月承诺最低消费48元即送价值300元的校园\n50M宽带\n合约期1年\n未达到最低消费系统将自动收取48元',
        value: '2',
        check: false,
        hidden: true,
        tareahidden: true
      },
      {
        ywlx: '低消38元每月500小时WiFi时长',
        ywsm: '每月承诺最低消费38元即送价值200元的校园WiFi\n500小时每月的时长\n合约期1年\n未达到最低消费系统将自动收取38元',
        value: '3',
        check: false,
        hidden: true,
        tareahidden: true
      },
      {
        ywlx: '3元每月150小时WiFi时长',
        ywsm: '合约期6个月，扣话费',
        value: '4',
        check: false,
        hidden: true,
        tareahidden: true
      },
      {
        ywlx: '6元每月300小时WiFi时长',
        ywsm: '合约期6个月，扣话费',
        value: '5',
        check: false,
        hidden: true,
        tareahidden: true
      },
      {
        ywlx: '套餐变更28档不限量',
        ywsm: '每月收取28元月租，10G国内流量+100分钟全国通话，流量超出后限速不限量\n变更套餐后，所有流量内用完10G或者20G都会限速，但是可以咨询10086人工服务进行解除限速操作，具体请咨询10086',
        value: '6',
        check: false,
        hidden: true,
        tareahidden: true
      },
      {
        ywlx: '套餐变更48档不限量',
        ywsm: '每月收取48元月租，20G国内流量+200分钟全国通话，流量超出后限速不限量\n变更套餐后，所有流量内用完10G或者20G都会限速，但是可以咨询10086人工服务进行解除限速操作，具体请咨询10086',
        value: '7',
        check: false,
        hidden: true,
        tareahidden: true
      },
      {
        ywlx: '两城一号',
        ywsm: '上大学不换号那就办两城一号，江西移动用户不想换号码可以办理此业务，办理后前绑定的宽带，集团网等业务将会取消，后期即可享受九江市的校园相关政策',
        value: '8',
        check: false,
        hidden: true,
        tareahidden: true
      },
      {
        ywlx: '其他',
        ywsm: '本栏为新活动栏 具体敬请期待 如有备注请填',
        value: '9',
        check: false,
      },
    ],

    teamCodes: ["A4", "A7", "A1", "B1"],
    teamCodeIndex: 0,
  },

  onLoad() {
    this.initValidate()
    console.log(this.WxValidate)
    wx.request({
      url: testServer,
      method: 'get',

      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        console.log('服务器连接正常')
      },
      fail: function(res) {
        console.log("服务器连接失败")
        wx.showModal({
          title: '温馨提示',
          content: '抱歉~服务器处于维护中！\n暂时无法提交数据，请稍后再试',
          showCancel: false,
          cancelText: 'Cancel',
          confirmText: '确定',
        })
      }
    })
  },
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },

  formSubmit: function(e) {

    const params = e.detail.value
    console.log("点击了提交")
    console.log(params)

    // 传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }

    //Todo提交时一直loading，成功弹成功框，失败弹失败框。
    wx.showToast({
      title: '数据上传中',
      icon: 'loading',
      duration: 10000
    });
    setTimeout(function() {
      wx.hideToast()
    }, 1500);

    console.log('form发生了submit事件成功，携带数据为：', e.detail.value)
    const that = this;
    wx.request({
      url: server,
      method: 'post',
      data: util.json2Form({
        userName: e.detail.value.userName,
        userPhone: e.detail.value.userPhone,
        userPassword: e.detail.value.userPassword,
        item: e.detail.value.item,
        room: e.detail.value.room,
        addTxt: e.detail.value.addTxt,
        myPhone: e.detail.value.myPhone,
        team: e.detail.value.team,
        myEmail: e.detail.value.myEmail,
        dcmy: e.detail.value.dcmy,
      }),

      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        console.log('数据上传成功')
        console.log(util.formatTime)
        console.log(res)
        wx.showModal({
          title: '温馨提示',
          content: '数据上传成功~请耐心等待业务办理',
          showCancel: false,
          cancelText: 'Cancel',
          confirmText: '确定',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击上传成功')
            }
          }
        })
      },
      fail: function(res) {
        console.log("数据上传失败")
        console.log("服务器可能在睡觉，请稍后再试哟")
        wx.showModal({
          title: '温馨提示',
          content: '数据上传失败~服务器可能在睡觉，请稍后再试哟',
          showCancel: false,
          cancelText: 'Cancel',
          confirmText: '确定',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击上传失败')
            }
          }
        })
      }
    })
  },

  initValidate() {
    // 验证字段的规则
    const rules = {
      userName: {
        required: true,
        userName: true,
        minlength: 2,
        maxlength: 10,
      },
      userPhone: {
        required: true,
        tel: true,
      },
      userPassword: {
        required: true,
        digits: true,
        minlength: 6,
        maxlength: 6,
      },
      item: {
        required: true,
        item: true,
      },
      addTxt: {
        maxlength: 200,
      },
      myPhone: {
        required: true,
        tel: true,
      },
      myEmail: {
        email: true,
      },
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      userName: {
        required: '请输入客户姓名',
        userName: '请问您是哪国人~看不懂你的姓名哦',
        minlength: '还有单字姓名？逗我吧',
      },
      userPhone: {
        required: '请输入客户手机号',
        tel: '请输入客户的正确手机号哟',
      },
      userPassword: {
        required: '请输入服务密码',
        minlength: '服务密码是6位数哦',
        maxlength: '服务密码是6位数哦',
      },
      item: {
        required: '至少选择一项业务哟',
      },
      addTxt: {
        maxlength: '建议反馈最多200个字符哦',
      },
      myPhone: {
        required: '请输入橙人手机号',
        tel: '请输入橙人的正确手机号哟',
      },
      myEmail: {
        email: '请输入正确的邮箱！不然可收不到邮件哟',
      },
    }

    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)

    // 自定义验证规则
    this.WxValidate.addMethod('item', (value, param) => {
      return this.WxValidate.optional(value) || (value.length >= 1 && value.length <= 8)
    }, '最少选择一项业务')
  },

  showModalRest: function(e) {
    var that = this;
    wx.showModal({
      title: '温馨提示',
      content: '是否确认重置',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      success: function(res) {
        if (res.confirm) {
          // ToDo 实现点击了确定在触发重置事件
          console.log('用户点击确定重置')
        } else if (res.cancel) {

          console.log('用户点击取消重置')
        }
      }
    })
  },
  formReset: function(e) {
    console.log('form发生了reset事件')
  },
  qrcodeClick: function() {
    wx.previewImage({
      current: "",
      urls: this.data.image
    });
  },
  bindTeamCodeChange: function(e) {
    console.log('picker team code 发生选择改变，携带值为', e.detail.value);

    this.setData({
      teamCodeIndex: e.detail.value
    })
  },
  //监听CheckBox多选框改变事件
  serviceValChange: function(e) {
    var allItems = this.data.allItems;
    var checkArr = e.detail.value;
    for (var i = 0; i < allItems.length; i++) {
      if (checkArr.indexOf(i + "") != -1) {
        allItems[i].checked = true;
      } else {
        allItems[i].checked = false;
      }
    }

    //判断一类单选功能，TODO有bug，需要获取每个box的唯一标识
    //解决！获取最后一个value，即相当于唯一ID   
    var i = e.detail.value.length-1
    console.log(e.detail.value[i])

    if (e.detail.value[i] == "1") {
      allItems[2].checked = false;
    } else if (checkArr[i] == "2") {
      allItems[1].checked = false;
    }

    if (e.detail.value[i] == "3") {
      allItems[4].checked = false;
      allItems[5].checked = false;
    } else if (checkArr[i] == "4") {
      allItems[3].checked = false;
      allItems[5].checked = false;
    } else if (checkArr[i] == "5") {
      allItems[3].checked = false;
      allItems[4].checked = false;
    }

    if (e.detail.value[i] == "6") {
      allItems[7].checked = false;
    } else if (checkArr[i] == "7") {
      allItems[6].checked = false;
    }

    this.setData({
      allItems: allItems
    })
  },
  phonecallevent: function(e) {
    wx.makePhoneCall({
      phoneNumber: this.data.phoneNum,
    })
  },
  //添加图片
  addImages: function(a) {
    var t = this;
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: function(a) {
        var e = a.tempFilePaths;
        t.setData({
          addImgBlock: !0,
          addImgs: e
        })
        /*,wx.uploadFile({
                  url: o + "img_upload/userid-" + r,
                  filePath: e[0],
                  name: "file",
                  formData: {
                    user: "test"
                  },
                  success: function (a) {
                    t.setData({
                      current: a.data,
                      urls: [a.data]
                    });
                  }
                }).onProgressUpdate(function (a) {
                  wx.showToast({
                    title: "上传" + a.progress + "%",
                    icon: "loading",
                    duration: 1e3
                  });
                });*/
      }
    });
  },
  previewImage: function(a) {
    wx.previewImage({
      current: "",
      urls: []
    });
  },
})