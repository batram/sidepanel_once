module.exports = {
  open_in_webview,
  outline,
}

let webview = document.querySelector("#frams")
webview.addEventListener("did-stop-loading", loadstop)

const outline_api = "https://api.outline.com/v3/parse_article?source_url="

function loadstop(e) {
  let url = webview.getURL()
  if (url.startsWith(outline_api)) {
    webview.executeJavaScript("(" + outline_jshook.toString() + ")()")
  } else {
    urlfield.value = webview.getURL()
  }
}

function open_in_webview(e) {
  e.preventDefault()
  e.stopPropagation()
  webview.loadURL(e.target.href)
  urlfield.value = e.target.href
}

reload_webview_btn.onclick = (x) => {
  webview.reload()
}

close_webview_btn.onclick = (x) => {
  webview.loadURL("about:blank")
}

outline_webview_btn.onclick = (x) => {
  let url = webview.getURL()
  if (!url.startsWith(outline_api)) {
    outline(url)
  } else {
    url = unescape(url.replace(outline_api, ""))
    webview.loadURL(url)
  }
}

function outline(url) {
  urlfield.value = url
  let options = {
    httpReferrer: "https://outline.com/",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36",
  }
  webview.loadURL(outline_api + escape(url), options)
}

function outline_jshook() {
  let data = JSON.parse(document.body.innerText).data
  document.body.innerHTML = "<h1>" + data.title + "</h1>"
  document.body.innerHTML += data.html
}
