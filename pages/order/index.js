import { request } from '../../request/index'
Page({
  data: {
    orderList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    orders: [],
    tabs: [
      {
        id: 0,
        value: '全部',
        isActive: true,
      },
      {
        id: 1,
        value: '待付款',
        isActive: false,
      },
      {
        id: 2,
        value: '待收货',
        isActive: false,
      },
      {
        id: 3,
        value: '退款/退货',
        isActive: false,
      },
    ],
  },

  onShow(options) {
    const Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo`

    //获取当前小程序的页面栈-数组 长度最大是10页面
    let pages = getCurrentPages()
    //数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1]
    //获取url上的type参数
    let { type } = currentPage.options
    //激活选中页面标题 当type=1时,index=0
    this.changeTitleByIndex(type - 1)
    this.getOrders(type, Authorization)
  },
  //获取订单列表的方法
  async getOrders(type, Authorization) {
    const res = await request({
      url: '/my/orders/all',
      header: Authorization,
      data: type,
    })
    this.setData({
      orders: res,
    })
  },

  //根据标题索引来激活选中 标题数组
  changeTitleByIndex(index) {
    //修改原数组
    let { tabs } = this.data
    tabs.forEach((v, i) => (i === index ? (v.isActive = true) : (v.isActive = false)))
    //赋值到data中
    this.setData({
      tabs,
    })
  },

  handleTabsItemChange(e) {
    //获取被点击标题的索引
    const { index } = e.detail
    this.changeTitleByIndex(index)
  },
})
