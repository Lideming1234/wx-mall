import { request } from '../../request/index'
Page({
  data: {
    goodsObj: {},
    isCollect: false,
  },
  GoodsInfo: {},
  onShow: function () {
    let pages = getCurrentPages()
    let currentPages = pages[pages.length - 1]
    const { goods_id } = currentPages.options

    this.getGoodsDetail(goods_id)
  },
  //获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({
      url: '/goods/detail',
      data: { goods_id },
    })
    this.GoodsInfo = goodsObj

    //获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync('collect') || []
    //判断当前商品是否被收藏
    let isCollect = collect.some((item) => item.goods_id === this.GoodsInfo.goods_id)

    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        //iphone手机不支持webp格式的图片,所以转换成jpg
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics,
      },
      isCollect,
    })
  },
  //点击轮播图 放大预览
  previewImage(e) {
    //构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map((item) => item.pics_mid)
    //接收传递过来的图片url
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      current,
      urls,
    })
  },
  //点击添加购物车
  cartAdd() {
    //1.获取缓存中的购物车数组
    let cart = wx.getStorageSync('cart') || []
    //2.判断商品对象是否存在于购物车中
    let index = cart.findIndex((item) => item.goods_id === this.GoodsInfo.goods_id)
    //3.不存在第一次添加
    if (index === -1) {
      this.GoodsInfo.num = 1
      this.GoodsInfo.checked = true
      cart.push(this.GoodsInfo)
    } else {
      //4.已经存在的购物车数据 执行num++
      cart[index].num++
    }
    //5.把购物车重新添加回缓存中
    wx.setStorageSync('cart', cart)
    //6.弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      //防止用户手抖
      mask: true,
    })
  },

  //点击商品收藏图标
  handleCollect() {
    //获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect') || []
    //判断商品是否被收藏过
    let index = collect.findIndex((item) => item.goods_id === this.GoodsInfo.goods_id)
    //当index!=-1 表示已经收藏过了
    if (index !== -1) {
      collect.splice(index, 1)
      wx.showToast({
        title: '取消收藏',
        icon: 'success',
        mask: true,
      })
    } else {
      collect.push(this.GoodsInfo)
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      })
    }
    //把数组存入到缓存中
    wx.setStorageSync('collect', collect)
    //修改data中的属性 isCollect
    this.setData({
      isCollect: !this.data.isCollect,
    })
  },
})
