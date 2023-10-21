import { handleErrorCode } from './utils/util'
import { initWs, syncMsg } from './utils/ws'
import { mkdir,g_chatdata_path } from './utils/stor'

App<IAppOption>({
  globalData: {},
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    mkdir(g_chatdata_path)

    // get openid
    let openid = wx.getStorageSync('openid')
    if (openid) {
      console.log('openid exist?..', openid)
      // websocket init
      initWs(openid)
    }
    else {
      // 登录
      wx.login({
        success: res => {
          console.log(res.code)
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: 'http://127.0.0.1:8080/wx/auth',
            method: 'POST',
            data: {
              code: res.code,
            },
            success({ data }: any): void {
              const rsp = data
              console.log(rsp)
              if (rsp.code !== 0) {
                console.log(rsp)
                handleErrorCode(rsp)
              } else {
                wx.setStorageSync('openid', rsp.data.openid)
                openid = rsp.data.openid
                wx.setStorageSync('session_key', rsp.data.session_key)

                // websocket init
                initWs(openid)
              }
            },
            fail(e: any) {
              console.log(e)
            }
          });
        },
        fail: res => {
          console.log(res)
        }
      })

    }
  }
})