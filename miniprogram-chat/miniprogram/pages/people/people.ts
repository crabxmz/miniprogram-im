import { g_chatdata_path, listdir } from '../../utils/stor'
import { registerOnMessageCallback, unregisterOnMessageCallback } from '../../utils/ws'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myid: '',
    peopleList: [] as any[],
    filenames: [] as string[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // init from storage
    this.data.myid = wx.getStorageSync('openid')

    // todo: load people list from somewhere
    const tmpPeopleList = [
      {
        myid: this.data.myid,
        peer: 'A'
      },
      {
        myid: this.data.myid,
        peer: 'B'
      },
      {
        myid: this.data.myid,
        peer: 'C'
      }
    ]

    // update ui
    this.setData({
      peopleList: tmpPeopleList
    })
    // console.log(this.data)
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
    // console.log(e.currentTarget.dataset.index,typeof(e.currentTarget.dataset.index),this.data.peopleList[e.currentTarget.dataset.index])
    const tar = this.data.peopleList[e.currentTarget.dataset.index]
    wx.navigateTo({
      'url': '/pages/message/message?param=' + encodeURIComponent(JSON.stringify(tar))
    })
  }
})