import { request } from '../../request/index'

Page({
  data: {
    goods: [],
    //控制搜索按钮的显示隐藏
    isFocus: true,
    //输入框的值
    inpValue: '',
  },
  //定义全局定时器ID
  TimeId: -1,
  //输入框改变事件
  handleInput(e) {
    //获取输入框的值
    const { value } = e.detail
    //检查合法性
    if (!value.trim()) {
      this.setData({
        goods: [],
        isFocus: true,
      })
      return
    }

    this.setData({
      isFocus: false,
    })

    //防抖 一般用于输入框中 防止重复输入 重复发送请求
    //节流 一般用于页面的下拉和上拉

    //要用定时器先清定时器
    clearTimeout(this.TimeId)
    this.TimeId = setTimeout(() => {
      //发送请求数据
      this.send(value)
    }, 1000)
  },

  async send(query) {
    const res = await request({
      url: '/goods/search',
      data: { query },
    })
    this.setData({
      goods: res.goods,
    })
  },

  //取消按钮的点击事件
  handleCancel() {
    this.setData({
      inpValue: '',
      goods: [],
      isFocus: true,
    })
  },
})
