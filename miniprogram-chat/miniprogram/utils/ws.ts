import { handleErrorCode } from './util'
import { storMsg } from './stor'

let onMessageCallback: Function[] = []
let g_private_websocket_domain = 'localhost:8888'
let g_private_openid = ''
let g_private_ws_url = 'ws://' + g_private_websocket_domain
let g_private_http_url = 'http://' + g_private_websocket_domain
export function registerOnMessageCallback(cb: Function) {
  console.log('registerOnMessageCallback..')
  onMessageCallback.push(cb)
}

export function unregisterOnMessageCallback(cb: Function) {
  console.log('unregisterOnMessageCallback..')
  onMessageCallback = onMessageCallback.filter(e => e !== cb)
}

export function initWs(openid: string) {
  if (!openid) {
    console.log("initWs invalid param..", openid)
    return
  }
  g_private_openid = openid
  const uu = g_private_ws_url + '/rtwowx/chat/' + openid

  // Open a WebSocket connection
  const socketTask = wx.connectSocket({
    url: uu, // Replace with your server's URL
    success: () => {
      console.log('WebSocket connection to', g_private_websocket_domain, 'established');
    },
    fail: e => {
      console.log('wx.connectSocket fail..', e)
    }
  });

  // Listen for WebSocket events
  socketTask.onOpen(function (res) {
    console.log('WebSocket connection opened:', res);
    // sync msg
    console.log('pull msg when start..')
    syncMsg(
      (msgArray: any) => {
        if (!Array.isArray(msgArray)) {
          console.log("sync result not an array")
          return
        }
        
        if (msgArray.length === 0) {
          return
        }

        let latestTs = msgArray[0].ts
        for (const msg of msgArray) {
          if (msg.ts > latestTs) {
            latestTs = msg.ts
          }
        }

        confirmSyncMsg(latestTs)
      }
    )
  });

  socketTask.onMessage(function (res: any) {
    for (const cb of onMessageCallback) {
      console.log('call onMessageCallback..')
      cb(res)
    }
    const msgObj = JSON.parse(res.data)
    console.log('Received message:', msgObj);
    storMsg([msgObj])
  });

  socketTask.onClose(function (res) {
    console.log('WebSocket connection closed:', res);
  });

  socketTask.onError(function (res) {
    console.error('WebSocket error:', res);
  });

  return socketTask
}

export function sendMsg(content: string, receiver: string, onSuccess?: Function) {
  wx.request({
    url: g_private_http_url + '/wx/msg/send',
    method: 'POST',
    data: {
      "sender": g_private_openid,
      "receiver": receiver,
      "content": content
    },
    success({ data }: any): void {
      if (data.code) {
        handleErrorCode(data.code)
        return
      }
      if (onSuccess) {
        onSuccess(data.data)
      }
      console.log("发送成功")
    },
    fail(e: any) {
      console.log(e)
    }
  });
}

export function syncMsg(onSuccess?: Function) {
  console.log('syncMsg.....', g_private_http_url + '/wx/msg/pull')
  wx.request({
    url: g_private_http_url + '/wx/msg/pull',
    method: 'POST',
    data: {
      "receiver": g_private_openid,
      "sender": "*"
    },
    success({ data }: any): void {
      if (data.code) {
        handleErrorCode(data.code)
        console.log("拉取失败", data)
        return
      }
      console.log("拉取成功..",data.data.oldmsgs.length)
      // store
      storMsg(data.data.oldmsgs)
      // update ui
      if (onSuccess) {
        onSuccess(data.data.oldmsgs)
      }
    },
    fail(e: any) {
      console.log("拉取失败", e)
    }
  });
}

export function confirmSyncMsg(lastSyncTs: string) {
  wx.request({
    url: g_private_http_url + '/wx/msg/pullConfirm',
    method: 'POST',
    data: {
      "receiver": g_private_openid,
      "ts": lastSyncTs,
      "sender": "*"
    },
    success({ data }: any): void {
      if (data.code) {
        handleErrorCode(data.code)
        return
      }
      console.log("确认拉取成功")
    },
    fail(e: any) {
      console.log(e)
    }
  });
}

export function genSessionKey(id1: string, id2: string) {
  if (id1 > id2) {
    return `${id2}_____${id1}`
  } else {
    return `${id1}_____${id2}`
  }
}