import { request } from '../../request/index'
Page({
  data: {
    swiperList: [],
    cateList: [],
    floorList: [],
  },
  onLoad: function (options) {
    this.getSwiperList()
    this.getCateList()
    this.getFloorList()
  },

  //获取轮播图数据
  getSwiperList() {
    request({
      url: '/home/swiperdata',
    }).then((res) => {
      res.map((item) => (item.navigator_url = item.navigator_url.replace(/main/, 'index')))

      this.setData({
        swiperList: res,
      })
    })
  },
  // 获取分类导航数据
  getCateList() {
    request({
      url: '/home/catitems',
    }).then((res) => {
      this.setData({
        cateList: res,
      })
    })
  },
  //获取楼层数据
  getFloorList() {
    request({
      url: '/home/floordata',
    }).then((res) => {
      res.map((item) => {
        item.product_list.map((item2) => {
          item2.navigator_url = item2.navigator_url.replace(/t/, 't/index')
        })
      })

      this.setData({
        floorList: res,
      })
    })
  },
})
