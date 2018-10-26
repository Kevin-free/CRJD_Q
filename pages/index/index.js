import WxValidate from '../../assets/plugins/wx-validate/WxValidate' //引入第三方验证信息库
const qiniuUploader = require("../../utils/qiniuUploader");
var util = require('../../utils/util.js');
var Dec = require('../../utils/public.js'); //引用封装好的加密解密js
//var e, n, s = require("../../libs/qqmap-wx-jssdk.js");

//获取应用实例
var app = getApp(); 
var Server = app.globalData.server; 
var insertServer = Server + "toDBDemo/UserAction/Insert"; 
var checkCrServer = Server + "toDBDemo/UserAction/CheckCr"
var verServer = Server + "toDBDemo/AdminAction/ControlVer"
var imgServer = Server + "toDBDemo/image/upToken"
var updatPhone, updateRoom = null; //用于记录更新电话号码
var imgName = null; //用于记录图片名称
var itemll = null;
var fakeVersion = "3"; //审核时的假版本号
var flag13,flag4;
var varcheckConf = false;

// 初始化七牛相关参数
function initQiniu() {
  var options = {
    region: 'SCN', // 华北区
    uptokenURL: imgServer, //别忘了加项目名/urlPatterns
    // uptoken: 'xxx',
    domain: 'http://pemli1hxj.bkt.clouddn.com',
    shouldUseQiniuFileName: false
  };
  qiniuUploader.init(options);
}

Page({
  data: {
    isFake: true,
    phoneNum: '14796765019',
    timeStamp: 0,
    hiddenfwmm: true, //设置变量标记是否隐藏
    hiddencrhm: true,
    hiddencryx: true,
    imageObject: {},

    form: {
      userName: '',
      userPhone: '',
      userPassword: '',
      imgPhone: '',
      item: '',
      itemll: '',
      room: '',
      addTxt: '',
      myPhone: '',
      team: '',
      //myMail: '',
      dcmy: '',
    },

    allItems: [{
        ywlx: '预约办卡',
        ywsm: '新的城市.新的号码.欢迎预约九江校园移动卡.现在办理即可获得预存100元送100元话费200元宽带200元校园WiFi校内流量40G……',
        hiddena: true,
        value: '00',
        checked: false,
        hidden: true,
        tareahidden: true,
        hiddenll: true,
      },
      {
        ywlx: '免费送40G校内流量',
        ywsm: '校内流量：只能在校园基站内使用.超出范围会自动切换为套餐内普通流量。\n(本业务不单独办理，要办理必须办理国内定向流量包)',
        hiddena: true,
        value: '01',
        checked: false,
        hidden: true,
        tareahidden: true,
        hiddenll: true,
      },
      {
        ywlx: '低消38元每月20M宽带',
        ywsm: '每月承诺最低消费38元即送价值200元的校园\n20M宽带\n合约期1年\n未达到最低消费系统将自动收取38元',
        hiddena: true,
        value: '02',
        checked: false,
        hidden: true,
        tareahidden: true,
        hiddenll: true,
      },
      {
        ywlx: '低消48元每月50M宽带',
        ywsm: '每月承诺最低消费48元即送价值300元的校园\n50M宽带\n合约期1年\n未达到最低消费系统将自动收取48元',
        hiddena: true,
        value: '03',
        checked: false,
        hidden: true,
        tareahidden: true,
        hiddenll: true,
      },
      {
        ywlx: '低消38元每月500小时WiFi时长',
        ywsm: '(办理宽带免费赠送，不需要可备注取消) 每月承诺最低消费38元即送价值200元的校园WiFi\n500小时每月的时长\n合约期1年\n未达到最低消费系统将自动收取38元',
        hiddena: true,
        value: '04',
        checked: false,
        hidden: true,
        tareahidden: true,
        hiddenll: true,
      },
      {
        ywlx: '3元每月150小时WiFi时长',
        ywsm: '合约期6个月，扣话费',
        hiddena: true,
        value: '05',
        checked: false,
        hidden: true,
        tareahidden: true,
        hiddenll: true,
      },
      {
        ywlx: '6元每月300小时WiFi时长',
        ywsm: '合约期6个月，扣话费',
        hiddena: true,
        value: '06',
        checked: false,
        hidden: true,
        tareahidden: true,
        hiddenll: true,
      },
      {
        ywlx: '校园国内不限量28卡',
        ywsm: '每月收取28元月租，10G国内流量+100分钟全国通话，流量超出后限速不限量\n变更套餐后，所有流量内用完10G都会限速，但是可以咨询10086人工服务进行解除限速操作，具体请咨询10086(注:变更套餐次月生效)',
        hiddena: true,
        value: '07',
        checked: false,
        hidden: true,
        tareahidden: true,
        hiddenll: true,
      },
      {
        ywlx: '校园国内不限量48卡',
        ywsm: '每月收取48元月租，20G国内流量+200分钟全国通话，流量超出后限速不限量\n变更套餐后，所有流量内用完20G都会限速，但是可以咨询10086人工服务进行解除限速操作，具体请咨询10086(注:变更套餐次月生效)',
        hiddena: true,
        value: '08',
        checked: false,
        hidden: true,
        tareahidden: true,
        hiddenll: true,
      },
      {
        ywlx: '两城一号',
        ywsm: '上大学不换号那就办两城一号，江西移动用户不想换号码可以办理此业务，办理后前绑定的宽带，集团网等业务将会取消，后期即可享受九江市的校园相关政策(注:合账用户不可办理)',
        hiddena: true,
        value: '09',
        checked: false,
        hidden: true,
        tareahidden: true,
        hiddenll: true,
      },
      {
        ywlx: '校园免费V网',
        ywsm: '本业务为校园套餐自带业务.办理业务时会给予开通.开通后相同网内互打不扣套餐内分钟数.使用3000分钟的集团网分钟数.功能费0元',
        hiddena: true,
        value: '10',
        checked: false,
        hidden: true,
        tareahidden: true,
        hiddenll: true,
      },
      {
        ywlx: '校园权益包',
        ywsm: '[1] 每月30元功能费(月初出账)，次月赠送20元和包红包，有效期12个月。[2]和包每月月初到账如欠费则和包红包无法到账。[3]因第三方接口原因，办理成功后不能撤单。[4] 会员可每月登录和我信一校园大学生专区领取会员专享30G校内流量、30G定向流向，欠费状态下无法领取;[5] 还有更多权利如淘宝、支付宝、美团、滴滴、视频彩铃、电竞部落会员体验等可直接线上领取。',
        hiddena: true,
        value: '11',
        checked: false,
        hidden: true,
        tareahidden: true,
        hiddenll: true,
      },
      {
        ywlx: '存送话费',
        ywsm: '交100元最高得300.50立即到账.赠送的话费按照每月消费的百分百进行划拨.第六个月返还50本金.具体看网龄长短（一年以下的200.1-2年以下得250.两年以上300得300.默认给您办理最高优惠）合约期6个月',
        hiddena: true,
        value: '12',
        checked: false,
        hidden: true,
        tareahidden: true,
        hiddenll: true,
      },
      {
        ywlx: '国内视频定向流量',
        ywsm: '最多选3个，最少选2个。\n爱奇艺：30G国内定向流量覆盖爱奇艺视频APP \n优酷：30G国内定向流量覆盖优酷视频APP \n头条：30G国内定向覆盖今日头条，抖音，火山小视频，懂车帝，钠镁股票，悟空问答6个APP',
        hiddena: true,
        value: '13',
        checked: false,
        hidden: true,
        tareahidden: true
      },
      {
        ywlx: '其他',
        ywsm: '本栏为新活动栏 具体敬请期待 如有备注请填',
        hiddena: true,
        value: '14',
        checked: false,
        hiddenll: true,
      },
    ],

    itemsll:[
      { value: '1', name: '爱奇艺', checked: false, },
      { value: '2', name: '优酷', checked: false, },
      { value: '3', name: '头条', checked: false, },
    ],
    
    teamCodes: ["九院本部A4队", "九院本部A7队", "九院本部B9队"],
    teamCodeIndex: 1,
  },

  isOpenfwmm: function(e) {
    var that = this;
    var hiddenfwmm = this.data.hiddenfwmm;
    if (hiddenfwmm == true) {
      that.setData({
        hiddenfwmm: !hiddenfwmm,
      })
    } else {
      that.setData({
        hiddenfwmm: !hiddenfwmm,
      })
    }
  },
  isOpencrhm: function(e) {
    var that = this;
    var hiddencrhm = this.data.hiddencrhm;
    if (hiddencrhm == true) {
      that.setData({
        hiddencrhm: !hiddencrhm,
      })
    } else {
      that.setData({
        hiddencrhm: !hiddencrhm,
      })
    }
  },
  isOpencryx: function(e) {
    var that = this;
    var hiddencryx = this.data.hiddencryx;
    if (hiddencryx == true) {
      that.setData({
        hiddencryx: !hiddencryx,
      })
    } else {
      that.setData({
        hiddencryx: !hiddencryx,
      })
    }
  },

  isOpen: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var allItems = that.data.allItems;
    var hiddenaa = allItems[index].hiddena;
    if (hiddenaa == true) {
      that.setData({
        ['allItems[' + index + '].hiddena']: !hiddenaa,
      })
    } else {
      that.setData({
        ['allItems[' + index + '].hiddena']: !hiddenaa,
      })
    }
  },

  onLoad() {
    var that = this;
    wx.request({
      url: verServer,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log("后台传回的version信息:" + res.data.ver);
        if (res.data.ver == fakeVersion) {
          that.setData({
            isFake: true
          })
          console.log("show fakeView")
        } else {
          that.setData({
            isFake: false
          })
          console.log("show realView")
        }
      }
    })

    // var jiami = Dec.Encrypt('test')
    // console.log('test AES加密：' + jiami);
    // var jiemi = Dec.Decrypt(jiami);
    // console.log('test AES解密：' + jiemi);

    this.initValidate()
    console.log(this.WxValidate)
    wx.request({
      url: Server,
      method: 'get',

      success: function(res) {
        console.log('服务器连接正常' + Server)
      },
      fail: function(res) {
        console.log('服务器连接失败' + Server)
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

  changeConf:function(e){
    console.log("tap changeConf")
    // this.setData({
    //   checkConf: !varcheckConf
    // })
    varcheckConf = !varcheckConf;
    console.log(varcheckConf)
  },

  formSubmit: function(e) {
    const params = e.detail.value
    console.log("点击了提交")
    console.log("checkConf:"+varcheckConf)

    // 传入表单数据，先调用验证方法
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }

    //判断选择宽带限制
    if (this.data.allItems[2].checked || this.data.allItems[3].checked) {
      if (updateRoom == null || updateRoom == "") {
        wx.showModal({
          content: '您选择了宽带 \n请备注输入宿舍号方便安装哦',
          showCancel: false,
        })
        return false
      }
    }

    //判断选择两城一号限制
    if (this.data.allItems[9].checked) {
      if (!(this.data.allItems[7].checked) && !(this.data.allItems[8].checked)) {
        wx.showModal({
          content: '您选择了两城一号 请在上两项中选择一个要变更的套餐哦',
          showCancel: false,
        })
        return false
      }
    }

    //判断勾选同意
    if (varcheckConf == false) {
      wx.showModal({
        content: '请勾选并同意办理业务',
        showCancel: false,
      })
      return false
    }

    //防止多次提交 20秒后才能提交第二次
    if (e.timeStamp - this.data.timeStamp <= 20000) {
      this.setData({
        timeStamp: e.timeStamp
      });
      wx.showModal({
        title: '温馨提示',
        content: '您提交频率太快了，请20秒后再试吧~',
        showCancel: false,
        confirmText: '确定',
      })
      return false;
    }
    this.setData({
      timeStamp: e.timeStamp
    });

    //显示提交时loading
    wx.showToast({
      title: '数据上传中',
      icon: 'loading',
      duration: 20000 //设置持续loading时间20s
    });

    //传到后台数据库，验证橙人权限是否能提交
    wx.request({
      url: checkCrServer, //验证后台服务
      //定义传到后台的数据
      data: {
        team: e.detail.value.team,
        phone: e.detail.value.myPhone,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log("调用CheckCrServer成功"); //改为isCheck
        console.log("后台传回的checkCr验证信息:" + res.data.isCheck);
        if (res.data.isCheck == "ok") {
          console.log('验证成功，发生submit事件，携带数据为：', e.detail.value)
          wx.request({
            url: insertServer, //插入后台服务
            method: 'post',
            data: util.json2Form({
              userName: e.detail.value.userName,
              userPhone: e.detail.value.userPhone,
              userPassword: e.detail.value.userPassword,
              imgPhone: imgName,
              item: e.detail.value.item,
              itemll: itemll,
              room: e.detail.value.room,
              addTxt: e.detail.value.addTxt,
              myPhone: e.detail.value.myPhone,
              team: e.detail.value.team,
              //myEmail: e.detail.value.myEmail,
              dcmy: e.detail.value.dcmy,
            }),

            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
              console.log("调用Insert成功");
              console.log("后台传回的insert验证信息" + res.data.isInsert);
              //成功时则取消loading
              setTimeout(function() {
                wx.hideToast()
              }, 10);
              if (res.data.isInsert == 'ok') {
                console.log('数据上传成功')
                //console.log(util.formatTime)
                console.log(res)
                wx.showModal({
                  title: '温馨提示',
                  content: '数据上传成功~请耐心等待业务办理',
                  showCancel: false,
                  confirmText: '确定',
                  success: function(res) {
                    if (res.confirm) {
                      console.log('用户点击上传成功')
                    }
                  }
                })
              } else {
                console.log('数据上传失败')
                console.log(res)
                wx.showModal({
                  title: '温馨提示',
                  content: '数据上传失败~请检查输入数据或联系营业员',
                  showCancel: false,
                  confirmText: '确定',
                })
              }
            },
            fail: function(res) {
              //失败也取消loading
              setTimeout(function() {
                wx.hideToast()
              }, 10);
              console.log("数据上传失败")
              wx.showModal({
                title: '温馨提示',
                content: '数据上传失败~服务器可能在睡觉，请稍后再试哟',
                showCancel: false,
                confirmText: '确定',
                success: function(res) {
                  if (res.confirm) {
                    console.log('用户点击上传失败')
                  }
                }
              })
            }
          })
        } else {
          setTimeout(function() {
            wx.hideToast()
          }, 10);
          wx.showModal({
            title: '温馨提示',
            content: '您输入的橙人号码没有提交权限哦~ \n请输入正确橙人号码',
            showCancel: false
          })
        }
      },
      fail: function(res) {
        setTimeout(function() {
          wx.hideToast()
        }, 10);
        console.log("调用CheckCrServer失败");
        wx.showModal({
          title: '温馨提示',
          content: '连接失败~服务器可能在睡觉，请稍后再试哟',
          showCancel: false,
          confirmText: '确定',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击')
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
      itemll: {
        itemll: true,
      },
      addTxt: {
        maxlength: 140,
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
      return this.WxValidate.optional(value) || (value.length >= 1 && value.length <= 12)
    }, '最少选择一项业务')

    this.WxValidate.addMethod('itemll', (value, param) => {
      return this.WxValidate.optional(value) || (value.length >= 0 && value.length <= 2)
    }, '最多选择两项')
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
    var teamIndex = this.data.teamCodeIndex;
    var allItems = this.data.allItems;
    for (var i = 0; i < allItems.length; i++) {
      allItems[i].checked = false;
    }
    this.setData({
      teamCodeIndex: teamIndex,
      allItems: allItems
    })
    console.log('form发生了reset事件')
  },
  bindTeamCodeChange: function(e) {
    console.log('picker team code 发生选择改变，携带值为', e.detail.value);

    this.setData({
      teamCodeIndex: e.detail.value
    })
  },
  updateRoom: function(e) {
    updateRoom = e.detail.value;
    console.log("updateRoom:" + updateRoom)
  },

  checkboxChange: function (e) {
    var itemsll = this.data.itemsll;
    if ((e.detail.value).length == 3) {
      wx.showToast({
        title: '最多选择两项',
        icon: 'none'
      })
    }
    if ((e.detail.value).length == 0) {
      itemll = null
    }
    if((e.detail.value).indexOf("1") != -1){
      itemll = "爱奇艺"
    }
    if ((e.detail.value).indexOf("2") != -1) {
      itemll = "优酷"
    }
    if ((e.detail.value).indexOf("3") != -1) {
      itemll = "头条"
    }
    if (((e.detail.value).indexOf("1") != -1) && ((e.detail.value).indexOf("2") != -1)) {
      itemll = "爱奇艺,优酷"
    }
    if (((e.detail.value).indexOf("1") != -1) && ((e.detail.value).indexOf("3") != -1)) {
      itemll = "爱奇艺,头条"
    }
    if (((e.detail.value).indexOf("2") != -1) && ((e.detail.value).indexOf("3") != -1)) {
      itemll = "优酷,头条"
    }
    if (((e.detail.value).indexOf("1") != -1) && ((e.detail.value).indexOf("2") != -1) && ((e.detail.value).indexOf("3") != -1)) {
      itemll = "爱奇艺,优酷,头条"
    }
    console.log("itemll:"+itemll)
    formData: {
      itemll: itemll
    }
    this.setData({
      itemsll: itemsll
    })
  },
  //监听CheckBox多选框改变事件   
  //CheckBox边框变色
  serviceValChange: function(e) {
    var that = this;
    console.log("checkbox value:"+e.detail.value)
    var allItems = this.data.allItems;
    var checkArr = e.detail.value;
    for (var i = 0; i < allItems.length; i++) {
      if ((checkArr.indexOf(i + "") != -1) || (checkArr.indexOf("0" + i + "") != -1)) {
        allItems[i].checked = true;
      } else {
        allItems[i].checked = false;
      }
    }

    //判断一类单选功能，TODO有bug，需要获取每个box的唯一标识
    //解决！获取最后一个value，即相当于唯一ID
    //TODO待解决bug，选择另一个则之前强行选择失效。需setData
    //业务关联选择限制
    var i = e.detail.value.length - 1
    //设置选项关联
    if (e.detail.value[i] == "01") {
      allItems[13].checked = true;
      flag13 = true;
    }
    if (e.detail.value[i] == "02" || e.detail.value[i] == "03") {
      allItems[4].checked = true;
      flag4 = true;
    }

    if (e.detail.value[i] == "02") {
      allItems[3].checked = false;
    } else if (checkArr[i] == "03") {
      allItems[2].checked = false;
    }

    if (e.detail.value[i] == "04") {
      allItems[5].checked = false;
      allItems[6].checked = false;
    } else if (checkArr[i] == "05") {
      allItems[4].checked = false;
      allItems[6].checked = false;
    } else if (checkArr[i] == "06") {
      allItems[4].checked = false;
      allItems[5].checked = false;
    }

    if (e.detail.value[i] == "07") {
      allItems[8].checked = false;
    } else if (checkArr[i] == "08") {
      allItems[7].checked = false;
    }
    
    if(flag13 == true){
      allItems[13].checked = allItems[1].checked;
    }
    if(flag4 == true){
      allItems[4].checked = allItems[2].checked || allItems[3].checked;
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
  updatePhone: function(e) {
    updatPhone = e.detail.value;
  },
  //添加图片
  addImages: function(a) {
    var t = this;
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: function(a) {
        imgName = imageObject.imageURL;
        var e = a.tempFilePaths;
        t.setData({
          addImgBlock: !0,
          addImgs: e
        }), wx.uploadFile({
          url: Server + "toDBDemo/UserAction/UploadPic",
          filePath: e[0],
          name: "file",
          header: {
            "Content-Type": "multipart/form-data"
          },
          formData: {
            userPhone: imgName
          },
          success: function(a) {
            t.setData({
              current: a.data,
              urls: [a.data]
            });
            console.log("图片上传成功！" + imgName);
          },
          fail: function(a) {
            console.log("上传失败！");
          }
        }).onProgressUpdate(function(a) {
          wx.showToast({
            title: "上传" + a.progress + "%",
            icon: "loading",
            duration: 1e3
          });
        });
      }
    });
  },
  previewImage: function(a) {
    wx.previewImage({
      current: "",
      urls: []
    });
  },
  //删除上传图片
  delImg: function(e) {
    var t = this;
    t.setData({
      addImgBlock: 0,
    })
    updatPhone = null;
    console.log("doDelImg" + updatPhone)
  },

  //用户点击右上角分享
  onShareAppMessage: function() {

  },

  didPressChooesImage: function () {
    var that = this;
    didPressChooesImage(that);
  },
  didCancelTask: function () {
    this.data.cancelTask()
  }
});

function didPressChooesImage(that) {
  initQiniu();
  // 微信 API 选文件
  wx.chooseImage({
    count: 1,
    success: function (res) {
      var filePath = res.tempFilePaths[0];
      // 交给七牛上传
      qiniuUploader.upload(filePath, (res) => {
        that.setData({
          'imageObject': res,
          addImgBlock: !0,
        });
        imgName = res.imageURL;
      }, (error) => {
        console.error('error: ' + JSON.stringify(error));
      },     
        null, // 可以使用上述参数，或者使用 null 作为参数占位符
        (progress) => {
          console.log('上传进度', progress.progress)
          console.log('已经上传的数据长度', progress.totalBytesSent)
          console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend)
        },
        cancelTask => that.setData({
          cancelTask
        })
      );
    }
  })
}