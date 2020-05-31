import { request } from '../../request/index'
Page({
  data: {
    //左侧的菜单数据
    leftMenuList: [],
    //右侧的商品数据
    rightContent: [],
    //被点击的左侧的菜单
    currentIndex: 0,
    //右侧商品内容滚动位置
    scrollTop: 0,
  },
  //接口的返回数据
  Cates: [],

  onLoad: function (options) {
    //获取本地存储的数据
    const Cates = wx.getStorageSync('cates')
    if (!Cates) {
      this.getCates()
    } else {
      if (Date.now() - Cates.time > 1000 * 10) {
        //重新发送请求
        this.getCates()
      } else {
        //可以使用旧的数据
        this.Cates = Cates.data

        let leftMenuList = this.Cates.map((item) => item.cat_name)
        let rightContent = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent,
        })
      }
    }
  },
  async getCates() {
    // request({
    //   url: '/categories',
    // }).then((res) => {
    //   this.Cates = res.data.message

    //   //把接口请求的数据存到本地存储中
    //   wx.setStorageSync('cates', { time: Date.now(), data: this.Cates })
    //   //构造左侧的菜单数据
    //   let leftMenuList = this.Cates.map((item) => item.cat_name)
    //   //构造右侧的商品数据
    //   let rightContent = this.Cates[0].children
    //   this.setData({
    //     leftMenuList,
    //     rightContent,
    //   })
    // })
    const res = await request({ url: '/categories' })
    this.Cates = res
    //把接口请求的数据存到本地存储中
    wx.setStorageSync('cates', { time: Date.now(), data: this.Cates })
    //构造左侧的菜单数据
    let leftMenuList = this.Cates.map((item) => item.cat_name)
    //构造右侧的商品数据
    let rightContent = this.Cates[0].children
    this.setData({
      leftMenuList,
      rightContent,
    })
  },
  //左侧的点击事件
  change(e) {
    const { index } = e.currentTarget.dataset
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      //把滚动位置置顶
      scrollTop: 0,
    })
  },
})
