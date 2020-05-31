import { request } from '../../request/index'
import { login } from '../../utils/asyncWx'

Page({
  data: {},
  //获取用户信息
  async handleGetUserInfo(e) {
    try {
      //获取用户信息
      const { encryptedData, signature, rawData, iv } = e.detail
      //获取小程序登录成功后的code
      const { code } = await login()
      const loginParams = { encryptedData, signature, rawData, iv }
      //发送请求,获取用户的token
      const { token } = await request({
        url: '/users/wxlogin',
        method: 'post',
        data: loginParams,
      })
      //把token存入缓存中,同时跳转回上一个页面
      wx.setStorageSync('token', token)
      wx.navigateBack({
        delta: 1,
      })
    } catch (err) {
      console.log(err)
    }
  },
})
