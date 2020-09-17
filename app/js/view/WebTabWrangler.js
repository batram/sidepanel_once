class WebTabWrangler {
  constructor() {
    this.tabs = []
  }

  init(el) {
    this.el = el
  }

  static isValidWCID(wc_id) {
    if (typeof id != "number") {
      id = parseInt(id)
      if (isNaN(id) || id < 0) {
        console.error("unusable id", id)
        return false
      }
    }

    return
  }

  addTab(wc_id) {
    if (!wc_id) {
      console.error("can't add tab with incomplete information")
      return
    }
    let existing_tab = tab_el_from_id(wc_id)
    if (existing_tab) {
      mark_tab_active(existing_tab)
    } else {
      let tab_content = document.querySelector("#tab_content")
      if (tab_content) {
        new_webtab(tab_content, wc_id)
      } else {
        console.error("failed to find tab_content to attach tabs")
        return
      }
    }
  }

  addTab() {}
}

module.exports = {
  WebTabWrangler,
}
