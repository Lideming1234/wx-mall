import { request } from '../../request/index'
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: '综合',
        isActive: true,
      },
      {
        id: 1,
        value: '销量',
        isActive: false,
      },
      {
        id: 2,
        value: '价格',
        isActive: false,
      },
    ],
    goodList: [],
  },
  //接口要的参数
  QueryParams: {
    query: '',
    cid: '',
    pageNum: 1,
    pageSize: 10,
  },
  //总页数
  totalPages: 1,

  onLoad: function (options) {
    this.QueryParams.cid = options.cid || ''
    this.QueryParams.query = options.query || ''

    this.getGoodList()
  },

  //获取商品列表数据
  async getGoodList() {
    const res = await request({
      url: '/goods/search',
      data: this.QueryParams,
    })
    //获取总条数
    const total = res.total
    //计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pageSize)

    this.setData({
      goodList: [...this.data.goodList, ...res.goods],
    })

    //关闭下拉刷新的窗口
    wx.stopPullDownRefresh()
  },

  //标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    //获取被点击的标题索引值
    const { index } = e.detail
    //修改原数组
    let { tabs } = this.data
    tabs.forEach((v, i) => (i === index ? (v.isActive = true) : (v.isActive = false)))
    //赋值到data中
    this.setData({
      tabs,
    })
  },
  //用户上拉触底事件
  onReachBottom() {
    //判断有没有下一页数据
    if (this.QueryParams.pageNum >= this.totalPages) {
      wx.showToast({
        title: '没有下一页数据',
      })
    } else {
      this.QueryParams.pageNum++
      this.getGoodList()
    }
  },
  //下拉刷新事件
  onPullDownRefresh() {
    //重置数组
    this.setData({
      goodList: [],
    })
    //重置页数
    this.QueryParams.pageNum = 1
    //发送请求
    this.getGoodList()
  },
})
