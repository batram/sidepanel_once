import * as presenters_backend from "./js/view/presenters_backend"
import { StoryMap } from "./js/data/StoryMap"
import { OnceSettings } from "./js/OnceSettings"

function iniBackground() {
  presenters_backend.custom_protocol()

  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error))
}

iniBackground()
