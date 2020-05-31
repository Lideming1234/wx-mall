Page({
  data: {
    tabs: [
      {
        id: 0,
        value: '体验问题',
        isActive: true,
      },
      {
        id: 1,
        value: '商品、商家投诉',
        isActive: false,
      },
    ],
    //被选中的图片路径 数组
    chooseImgs: [],
    //文本域内容
    textVal: '',
  },
  //外网图片的路径 数组
  UpLoadImgs: [],

  handleTabsItemChange(e) {
    const { index } = e.detail
    const { tabs } = this.data
    tabs.forEach((v, i) => (i === index ? (v.isActive = true) : (v.isActive = false)))
    this.setData({
      tabs,
    })
  },

  //点击+号 选择图片事件
  handleChooseImg() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          chooseImgs: [...this.data.chooseImgs, ...res.tempFilePaths],
        })
      },
    })
  },

  //点击图片删除事件
  removeImg(e) {
    const { index } = e.currentTarget.dataset
    const { chooseImgs } = this.data
    chooseImgs.splice(index, 1)
    this.setData({
      chooseImgs,
    })
  },

  //文本域的输入事件
  textInput(e) {
    this.setData({
      textVal: e.detail.value,
    })
  },

  //提交按钮的点击事件
  formSubmit() {
    //获取文本域的内容
    const { textVal, UpLoadImgs, chooseImgs } = this.data
    //合法性验证
    if (!textVal.trim()) {
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true,
      })
      return
    }
    //准备上传图片 到专门的图片服务器
    //上传文件的api不支持多个文件同时上传 要遍历数组,挨个上传
    wx.showLoading({
      title: '正在上传中',
      mask: true,
    })

    //判断有没有需要上传的图片数组
    if (chooseImgs.length != 0) {
      chooseImgs.forEach((item, index) => {
        wx.uploadFile({
          //图片上传到哪里
          url: 'https://api.6vzz.com/api/sinaimg.php?type=multipart',
          //被上传的文件路径
          filePath: item,
          //上传的文件名称  后台来获取文件 file
          name: 'file',
          //顺带的文本信息
          formData: {},
          success: (res) => {
            let url = JSON.parse(res.data).url
            this.UpLoadImgs.push(url)
          },
        })
        //所有的图片都上传完毕了才触发
        if (index === chooseImgs.length - 1) {
          wx.hideLoading()

          console.log('把文本内容和外网图片的数组提交到后台中')
          //提交都成功了
          //重置页面
          this.setData({
            textVal: '',
            chooseImgs: [],
          })
          //跳转回上一级页面
          wx.navigateBack({
            delta: 1,
          })
        }
      })
    } else {
      wx.hideLoading()
      wx.navigateBack({
        delta: 1,
      })
    }
  },
})
