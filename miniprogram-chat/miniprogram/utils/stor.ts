import { b64encode, b64decode } from './util'
export const g_chatdata_path = `${wx.env.USER_DATA_PATH}/rtwochat`
export const g_userdata_path = `${wx.env.USER_DATA_PATH}`
const fs = wx.getFileSystemManager()

export function storMsg(msgArray: any[]) {
  for (const msg of msgArray) {
    const targetFile = `${g_chatdata_path}/${msg.sessionid}`
    const content = `${b64encode(msg.content)},${msg.ts},${msg.sender};`
    appendToFile(targetFile, content)
  }
}

export function loadMsg(sessionName: string) {
  const targetFile = `${g_chatdata_path}/${sessionName}`
  const rawContent = fs.readFileSync(targetFile, 'utf8') as string
  // console.log('rawContent', rawContent)
  const rawMsgs = rawContent.split(';').filter(e => !!e)
  // console.log(rawMsgs)
  const readres = rawMsgs.map(e => {
    const cols = e.split(',')
    return new Object({
      content: b64decode(cols[0]),
      ts: cols[1],
      sender: cols[2]
    })
  })
  // console.log('readres', readres)
  return readres
}

export function mkdir(path: string) {
  try {
    fs.mkdirSync(path)
  } catch (e) {
    console.log(e.message)
  }
}

export function listdir(path: string) {
  try {
    const res = fs.readdirSync(path)
    // console.log(res)
    return res
  } catch (e) {
    console.error(e)
    return []
  }
}

export function appendToFile(targetFile: string, content: string) {
  try {
    if(!isFileOk(targetFile)){
      fs.writeFileSync(targetFile, '', 'utf8')
    }
    fs.appendFileSync(targetFile, content, 'utf8')
    // const rres = fs.readFileSync(targetFile, 'utf8', 0)
    // console.log('readFileSync..', rres)
  } catch (e) {
    console.error(e)
  }
}

export function isFileOk(path: string) {
  try {
    fs.accessSync(path)
    return true
  } catch (e) {
    console.log(e.message)
    return false
  }
}