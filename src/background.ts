import * as presenters_backend from "./js/view/presenters_backend"
import { StoryMap } from "./js/data/StoryMap"
import { OnceSettings } from "./js/OnceSettings"

function iniBackground() {
  new OnceSettings()
  new StoryMap()

  presenters_backend.custom_protocol()

  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error))
}

// Keep heartbeat
let heartTimer: number | NodeJS.Timeout
const keepAlive = () => {
  heartTimer && clearTimeout(heartTimer)
  heartTimer = setTimeout(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.info("[heartbeat]")
      tabs.length &&
        chrome.tabs.sendMessage(tabs[0].id, { action: "heartbeat" })
    })
    keepAlive()
  }, 10000)
}
keepAlive()

iniBackground()
