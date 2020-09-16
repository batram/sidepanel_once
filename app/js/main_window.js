const contextmenu = require("./js/view/contextmenu")
contextmenu.init_menu()

const settings = require("./js/settings")
const web_control = require("./js/web_control")
const seperation_slider = require("./js/view/sep_slider")
const search = require("./js/data/search")
const story_loader = require("./js/data/StoryLoader")
const { remote } = require("electron")

seperation_slider.init_slider()
web_control.window_events()
web_control.webtab_comms()

let cw = remote.getCurrentWindow()
let bw = cw.getBrowserView()
if (bw) {
  let wc = bw.webContents
  let tab_info = { wc_id: wc.id, view_id: bw.id }
  web_control.new_webtab(document.querySelector("#tab_content"), tab_info)
  //we opened as popup colapse left_panel
  let left_panel = document.querySelector("#left_panel")
  seperation_slider.collapse_left()
} else {
  window.state = "main"
  web_control.new_webtab(document.querySelector("#tab_content"))
}

document.addEventListener("DOMContentLoaded", async (_e) => {
  settings.init()

  search.init_search()

  let dev_cache = process.env.LDEV == "1"
  let sources = await settings.story_sources()

  story_loader.parallel_load_stories(sources, dev_cache)
})