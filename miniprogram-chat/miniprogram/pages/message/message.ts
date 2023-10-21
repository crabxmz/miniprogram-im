import { genSessionKey, sendMsg, syncMsg, registerOnMessageCallback, unregisterOnMessageCallback } from '../../utils/ws'
import { loadMsg, storMsg, isFileOk, g_chatdata_path } from '../../utils/stor'
import { formatTimeFromTsString } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myid: '',
    msgList: [] as any[],
    userinput: '',
    receiver: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    try {
      const sessionInfo = JSON.parse(decodeURIComponent(options.param))
      wx.setNavigationBarTitle({
        title: sessionInfo.peer,
        success: function () {
          // console.log('Page title updated successfully');
        },
        fail: function (err) {
          console.error('Failed to update page title', err);
        }
      });
      this.setData({
        myid: sessionInfo.myid,
        receiver: sessionInfo.peer
      })

      if (isFileOk(`${g_chatdata_path}/${genSessionKey(sessionInfo.myid, sessionInfo.peer)}`)) {
        const msgs = loadMsg(genSessionKey(sessionInfo.myid, sessionInfo.peer))
        msgs.sort((m1: any, m2: any) => {
          return m1.ts - m2.ts
        })
        this.setData({
          msgList: msgs
        })
      }
    } catch (e) {
      console.log(e)
    }
    // console.log("onload..", this.data)
    registerOnMessageCallback(this.onWsMessage)
    wx.pageScrollTo({
      scrollTop: 10000
    })
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
  onSend(e: any) {
    const onSuccess = (sendRsp: any) => {
      const msg = {
        content: this.data.userinput,
        sender: this.data.myid,
        ts: sendRsp.ts,
        sessionid: genSessionKey(this.data.myid, this.data.receiver)
      }
      // store
      storMsg([msg])
      // update ui
      this.setData({
        msgList: this.data.msgList.concat([msg])
      })
      this.setData({
        userinput: ''
      })
      wx.pageScrollTo({
        scrollTop: 10000
      })
    }

    sendMsg(this.data.userinput, this.data.receiver, onSuccess)

    // console.log('onsend..', this.data.userinput, this.data.receiver)
  },
  onWsMessage(msg: any) {
    // console.log('new msg', msg)
    const msgObj = JSON.parse(msg.data)
    const newMsg = {
      content: msgObj.content,
      sender: msgObj.sender,
      ts: msgObj.ts
    }
    this.setData({
      msgList: this.data.msgList.concat([newMsg])
    })
    wx.pageScrollTo({
      scrollTop: 10000
    })
  },
  handleUserinput(e: any) {
    this.setData({
      userinput: e.detail.value
    })
  },
  getDateStr(s: string) {
    return formatTimeFromTsString(s)
  }
})