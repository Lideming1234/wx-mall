import { getSetting, chooseAddress, openSetting, showModal, showToast } from '../../utils/asyncWx'
Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0,
  },

  onShow() {
    //获取缓存中的收货地址信息
    const address = wx.getStorageSync('address')
    //获取缓存中的购物车数据
    const cart = wx.getStorageSync('cart') || []

    this.setData({ address })
    this.setCart(cart)
  },

  //点击收获地址
  async handleChooseAddress() {
    try {
      const res1 = await getSetting()
      const scopeAddress = res1.authSetting['scope.address']
      if (scopeAddress === false) {
        await openSetting()
      }
      let address = await chooseAddress()
      address.all =
        address.provinceName + address.cityName + address.countyName + address.detailInfo
      // 存入到缓存中
      wx.setStorageSync('address', address)
    } catch (err) {
      throw err
    }
  },

  //商品的选中
  handeItemChange(e) {
    //获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id
    //获取购物车数组
    let { cart } = this.data
    //找到被修改的商品对象
    let cartItem = cart.find((item, index) => item.goods_id === goods_id)
    //选中状态取反
    cartItem.checked = !cartItem.checked

    this.setCart(cart)
  },

  //设置购物车状态同时重新计算底部工具栏的数据全选总价格购买的数量
  setCart(cart) {
    let allChecked = true
    //总价格 总数量
    let totalPrice = 0
    let totalNum = 0
    cart.forEach((item) => {
      if (item.checked) {
        totalPrice += item.num * item.goods_price
        totalNum += item.num
      } else {
        allChecked = false
      }
    })
    //判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false
    //给data赋值
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum,
    })
    //添加到缓存中
    wx.setStorageSync('cart', cart)
  },
  // 商品全选功能
  handleItemAllCheck() {
    //获取data中的数据
    let { cart, allChecked } = this.data
    //修改值
    this.data.allChecked = !this.data.allChecked
    //循环修改cart数组中商品的选中状态
    cart.forEach((item) => (item.checked = this.data.allChecked))

    this.setCart(cart)

    //添加到data中
    this.setData({
      cart,
    })
  },
  //商品数量的编辑功能
  async handleItemNumEdit(e) {
    //获取传递过来的参数
    const { id, operation } = e.currentTarget.dataset
    //获取购物车数组
    let { cart } = this.data
    //找到要修改的商品的索引
    const index = cart.findIndex((item) => item.goods_id === id)
    //判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      const res = await showModal({ content: '您是否要删除?' })
      if (res.confirm) {
        cart.splice(index, 1)
        this.setCart(cart)
      }
    } else {
      //进行修改数量
      cart[index].num += operation
      //设置回缓存和data中
      this.setCart(cart)
    }
  },
  //结算按钮的点击事件
  async handlePay() {
    //判断收获地址
    const { address, totalNum } = this.data
    if (!address.userName) {
      await showToast({ title: '您还没有选择收货地址' })
      return
    }
    //判断用户有没有选购商品
    if (totalNum === 0) {
      await showToast({ title: '您还没有选购商品' })
      return
    }
    //跳到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    })
  },
})
