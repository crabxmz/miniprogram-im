import { encode, decode } from 'base64-arraybuffer';
export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

export const formatTimeFromTsString = (s: string) => {
  return formatTime(new Date(parseInt(s, 13)))
}

const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

export function handleErrorCode(rsp: any) {
  console.log("handleErrorCode", rsp)
  // try {
  //   throw new Error('Printing call stack');
  // } catch (e) {
  //   console.log(e.stack);
  // }
  wx.showToast({ title: rsp.message, icon: "none" })
}

export function b64encode(input: string): string {
  // string 2 byte
  const view = new Uint16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    view[i] = input.charCodeAt(i);
    // console.log(typeof(input.charCodeAt(i)),input.charCodeAt(i))
  }

  // b64encode
  return encode(view.buffer)
}
export function b64decode(input: string): string {
  // b64decode
  const bytes = new Uint16Array(decode(input))
  let result = '';
  // byte 2 string
  for (let i = 0; i < bytes.length; i++) {
    result += String.fromCharCode(bytes[i]);
  }
  return result;
}