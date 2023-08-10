export class BackComms {
  static sendSync(arg0: string, ...args: any[]): boolean {
    throw new Error("Method not implemented. sendSync")
  }

  static sendTo(id: number, channel: string, ...args: any[]) {
    throw new Error("Method not implemented. sendTo")
  }

  static handlex(
    arg0: string,
    arg1: (event: any, cmd: any, ...args: unknown[]) => Promise<unknown>
  ) {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      ;(async function () {
        if (msg.cmd == arg0) {
          var key = await arg1(sender, msg.args.shift(), msg.args)
          sendResponse({ complete: true, res: key })
        }
      })()

      // return true to indicate you want to send a response asynchronously
      return true
    })
  }

  static async invoke(...args: any[]): Promise<any> {
    console.log("invoke", args)
    return new Promise(async (resolve, reject) => {
      const response = await chrome.runtime.sendMessage({
        cmd: args.shift(),
        args: args,
      })

      if (response && response.complete) {
        resolve(response.res)
      } else {
        console.error(response)
        reject("Something wrong")
      }
    })
  }

  static on(
    arg0: string,
    arg1: (event: any, ...args: any[]) => any,
    ...args: unknown[]
  ) {
    console.log("on", arg0, arg1)
    chrome.runtime.onMessage.addListener(async function (msg, sender) {
      let c = msg.cmd
      if (msg.send == "send" && arg0 == c) {
        console.log("on send recv", arg0, c, msg)
        arg1(sender, ...msg.args)
      }
    })
  }

  static send(...args: any[]) {
    let cmd = args.shift()
    console.log("send", cmd, args)
    return chrome.runtime.sendMessage({
      send: "send",
      cmd: cmd,
      args: args,
    })
  }
}
