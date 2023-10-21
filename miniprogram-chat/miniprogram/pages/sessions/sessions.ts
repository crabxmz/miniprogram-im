import { g_chatdata_path, listdir } from '../../utils/stor'
import { registerOnMessageCallback, unregisterOnMessageCallback } from '../../utils/ws'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myid: '',
    sessionList: [] as any[],
    filenames: [] as string[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // init from storage
    this.data.myid = wx.getStorageSync('openid')
    // set callback
    registerOnMessageCallback(
      this.onWsMessage
    )
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.data.filenames = listdir(g_chatdata_path)
    // console.log('listdir', filenames)

    // handle session list
    const sessions = this.data.filenames.map((v) => {
      return this.decodeSessionId(v)
    })

     // update ui
     this.setData({
      sessionList: sessions
    })
    // console.log(this.data)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    unregisterOnMessageCallback(this.onWsMessage)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  onTap(e: any) {
    // console.log(e.currentTarget.dataset.index,typeof(e.currentTarget.dataset.index),this.data.sessionList[e.currentTarget.dataset.index])
    const tar = this.data.sessionList[e.currentTarget.dataset.index]
    wx.navigateTo({
      'url': '/pages/message/message?param=' + encodeURIComponent(JSON.stringify(tar))
    })
  },
  onWsMessage(msg: any) {
    // console.log("session on msg cb..", msg)
    const msgObj = JSON.parse(msg.data)
    if (msgObj.sessionid && !this.data.filenames.includes(msgObj.sessionid)) {
      this.data.filenames.push(msgObj.sessionid)
      this.setData({
        sessionList: this.data.sessionList.concat([this.decodeSessionId(msgObj.sessionid)])
      })
      // console.log("appended sessionlist..", this.data.sessionList)
    }
  },
  decodeSessionId(sessionid: string) {
    const idList = sessionid.split('_____')
    if (!idList.includes(this.data.myid)) {
      console.log("session without me", this.data.myid, '?!', idList)
    }
    if (idList[0] === this.data.myid) {
      return {
        myid: idList[0],
        peer: idList[1]
      }
    } else {
      return {
        myid: idList[1],
        peer: idList[0]
      }
    }
  }

})