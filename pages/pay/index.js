import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
  requestPayment,
} from '../../utils/asyncWx'
import { request } from '../../request/index'
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0,
  },

  onShow() {
    //获取缓存中的收货地址信息
    const address = wx.getStorageSync('address')
    //获取缓存中的购物车数据
    let cart = wx.getStorageSync('cart') || []
    //过滤后的购物车数组
    cart = cart.filter((item) => item.checked)

    //总价格 总数量
    let totalPrice = 0
    let totalNum = 0
    cart.forEach((item) => {
      totalPrice += item.num * item.goods_price
      totalNum += item.num
    })

    this.setData({
      cart,
      totalPrice,
      totalNum,
      address,
    })
  },
  //点击支付
  async handleOrderPay() {
    try {
      //判断缓存中有没有token
      const token = wx.getStorageSync('token')
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index',
        })
        return
      }
      //创建订单

      //准备请求体参数
      const order_price = this.data.totalPrice
      const consignee_addr = this.data.address.all
      let goods = []
      cart.forEach((item) =>
        goods.push({
          goods_id: item.goods_id,
          goods_number: item.num,
          goods_price: item.goods_price,
        })
      )
      const orderParams = { order_price, consignee_addr, goods }
      //准备发送请求,创建订单,获取订单编号
      const { order_number } = await request({
        url: '/my/orders/create',
        method: 'post',
        data: orderParams,
      })
      //发起预支付接口
      const { pay } = await request({
        url: '/my/orders/req_unifiedorder',
        method: 'post',
        data: { order_number },
      })
      //发起微信支付
      await requestPayment(pay)
      //查询后台 订单状态
      const res = await request({
        url: '/my/orders/chkOrder',
        method: 'post',
        data: { order_number },
      })
      await showToast({ title: '支付成功' })

      //删除缓存中已经支付了的商品
      let newCart = wx.getStorageSync('cart')
      newCart = newCart.filter((item) => !item.checked)
      wx.setStorageSync('cart', newCart)

      //支付成功,跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index',
      })
    } catch (err) {
      await showToast({ title: '支付失败' })
      console.log(err)
    }
  },
})
