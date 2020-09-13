const { Story } = require("../data/Story")
const { resort_single } = require("./StoryList")
const story_parser = require("../parser")

module.exports = {
  story_html,
  info_block,
}

function story_html(story) {
  console.log(story)
  if (!(story instanceof Story)) {
    story = Story.from_obj(story)
    console.log(story)
  }

  let story_el = document.createElement("div")
  story_el.classList.add("story")
  story_el.addEventListener("change", (e) => {
    console.log(e.detail)
    if (e.detail.value instanceof Story && e.detail.name) {
      switch (e.detail.name) {
        //TODO diff class before after, or completley redraw or fix on-change
        case "star":
        case "unstar":
          update_star(e.detail.value.stared, story_el)
          break
        case "mark_as_read":
        case "open_in_webview":
          update_read(e.detail.value, story_el)
          break
      }
    } else if (e.detail.path.length == 2) {
      switch (e.detail.path[1]) {
        case "read":
          update_read(e.detail.value, story_el)
          break
        case "stared":
          update_star(e.detail.value, story_el)
          break
        case "filter":
          break
      }
    }
  })

  story_el.dataset.title = story.title
  story_el.dataset.href = story.href
  story_el.dataset.timestamp = story.timestamp
  story_el.dataset.type = "[" + story.type + "]"
  story_el.dataset.comment_url = story.comment_url

  let title_line = document.createElement("div")
  title_line.classList.add("title_line")

  let link = document.createElement("a")
  link.href = story.href
  link.classList.add("title")
  link.innerText = story.title
  title_line.appendChild(link)

  link.addEventListener(
    "click",
    (e) => {
      return story.open_in_webview(e)
    },
    false
  )

  let hostname = document.createElement("p")
  hostname.classList.add("hostname")
  hostname.innerText = " (" + link.hostname + ") "
  title_line.appendChild(hostname)

  let info = info_block(story)

  let data = document.createElement("div")
  document.createElement("data")
  data.classList.add("data")

  data.appendChild(title_line)
  data.appendChild(info)

  story_el.appendChild(data)

  //buttons
  story.has_or_get(story_el, "read", add_read_button)
  story.has_or_get(story_el, "stared", add_star_button)
  //         stories.resort_single(story_el)

  let filter_btn = icon_button("filter", "filter_btn", "imgs/filter.svg")
  if (story.filter) {
    filter_btn.title = "filtered"
    story_el.classList.add("filtered")
    let dinp = document.createElement("input")
    dinp.type = "text"
    dinp.value = story.filter
    dinp.disabled = true
    dinp.style.cursor = "pointer"
    filter_btn.prepend(dinp)
    filter_btn.style.borderColor = "red"
  }
  filter_btn.onclick = (x) => {
    filters.show_filter_dialog(x, filter_btn, story)
  }
  story_el.appendChild(filter_btn)

  let outline_btn = icon_button("outline", "outline_btn", "imgs/article.svg")
  outline_btn.onclick = (x) => {
    story.mark_as_read()
    web_control.outline(story.href)
  }
  story_el.appendChild(outline_btn)

  return story_el
}

function info_block(story) {
  let info = document.createElement("div")
  info.classList.add("info")
  info.dataset.tag = "[" + story.type + "]"
  let type = document.createElement("p")
  type.classList.add("tag")
  type.innerText = story.type
  info.appendChild(type)

  let og_link = document.createElement("a")
  og_link.innerText = " [OG] "
  og_link.href = story.href
  og_link.addEventListener("click", (e) => {
    return story.open_in_webview(e)
  })
  info.appendChild(og_link)

  //comments
  let comments_link = document.createElement("a")
  comments_link.classList.add("comment_url")
  comments_link.innerText = " [comments] "
  comments_link.href = story.comment_url
  comments_link.addEventListener("click", (e) => {
    story.open_in_webview(e)
  })
  info.appendChild(comments_link)

  info.appendChild(
    document.createTextNode(
      "  " + story_parser.human_time(story.timestamp) + "  "
    )
  )

  return info
}

function icon_button(title, classname, icon_src) {
  let btn = document.createElement("div")
  btn.classList.add("btn")
  btn.classList.add(classname)
  let icon = document.createElement("img")
  icon.src = icon_src
  btn.appendChild(icon)
  btn.title = title
  return btn
}

function add_read_button(story_el, story) {
  let read_btn = icon_button("", "read_btn", "")
  story_el.appendChild(read_btn)

  label_read(story_el)

  read_btn.addEventListener("click", (x) => {
    const { resort_single } = require("./StoryList")
    toggle_read(story.href, resort_single)
  })

  //open story with middle click on "skip reading"
  read_btn.addEventListener("mousedown", (e) => {
    if (e.button == 1) {
      return story.open_in_webview(e)
    }
  })
}

function update_read(read, story_el) {
  if (read) {
    story_el.classList.add("read")
  } else {
    story_el.classList.remove("read")
  }
  label_read(story_el)
}

function label_read(story_el) {
  let btn = story_el.querySelector(".read_btn")

  if (!btn) {
    return
  }
  let icon = btn.querySelector("img")

  if (!story_el.classList.contains("read")) {
    btn.title = "skip reading"
    icon.src = "imgs/read.svg"
  } else {
    btn.title = "mark as unread"
    icon.src = "imgs/unread.svg"
  }
}

function toggle_read(href, callback) {
  let story_el = document.querySelector('.story[data-href="' + href + '"]')
  let story = story_loader.story_map.get(href)

  let anmim_class = ""

  if (story_el.classList.contains("read")) {
    story_el.classList.remove("read")
    story.remove_from_readlist()
    story.read = false
    anmim_class = "unread_anim"
  } else {
    story_el.classList.add("read")
    story.add_to_readlist()
    story.read = true
    anmim_class = "read_anim"
  }

  label_read(story_el)

  if (typeof callback == "function") {
    let resort = callback(story_el)
    if (typeof resort == "function") {
      if (document.body.classList.contains("animated")) {
        story_el.classList.add(anmim_class)
        story_el.addEventListener("transitionend", resort, false)
      } else {
        resort()
      }
    }
  }
}

function add_star_button(story_el, story) {
  if (story.hasOwnProperty("stored_star")) {
    story_el.classList.add("stored_star")
  }

  let star_btn = icon_button("", "star_btn", "")
  story_el.appendChild(star_btn)
  label_star(story_el)

  star_btn.addEventListener("click", (_) => {
    if (story.stared) {
      story.unstar()
    } else {
      story.star()
    }
  })
}

function label_star(story_el) {
  let btn = story_el.querySelector(".star_btn")

  if (!btn) {
    return
  }
  let icon = btn.querySelector("img")

  if (story_el.classList.contains("stared")) {
    btn.title = "remove bookmark"
    icon.src = "imgs/star_fill.svg"
  } else {
    btn.title = "bookmark"
    icon.src = "imgs/star.svg"
  }
}

function update_star(stared, story_el) {
  if (stared) {
    story_el.classList.add("stared")
  } else {
    story_el.classList.remove("stared")
  }

  label_star(story_el)
}