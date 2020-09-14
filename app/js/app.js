const settings = require("./js/settings")
const web_control = require("./js/web_control")
const seperation_slider = require("./js/sep_slider")
const search = require("./js/search")
const story_loader = require("./js/data/StoryLoader")

web_control.init_menu()
web_control.attach_webtab()

document.addEventListener("DOMContentLoaded", async (_e) => {
  settings.init()

  seperation_slider.init_slider()
  search.init_search()

  let dev_cache = process.env.LDEV == "1"
  let sources = await settings.story_sources()

  story_loader.parallel_load_stories(sources, dev_cache)
})
