function append(cnt, e) { cnt.appendChild(document.createElement(e)) }
function appendTxt(cnt, s) { cnt.appendChild(document.createTextNode(s)) }
function create(s) { return document.createElement(s) }

var style = create("style")
style.innerHTML = `

body{
	background-color:#eee;
	font:normal normal normal 16px/1.5 Arial,sans-serif;
	margin-left:10px;margin-right:10px;max-width:730px;
}

pre{
	background-color:#f8f8f8;
	border:1px solid gray;
	border-radius:5px;
	padding:5px;
	font:normal normal normal 14px/1.3 monospace;
	width:calc(100vw - 48px);
	max-width:700px;
	overflow-y:auto;
}

pre.code {
	width:calc(100vw - 400px);
	max-width:380px;
	max-height:80vh;
	min-height:128px;
}
textarea {
	background-color:#f8f8f8;
	margin-left:12px;
	border:1px solid gray;
	border-radius:5px;
	padding:5px;
	font:normal normal normal 14px/1.3 Courier New,monospace;
	width:310px;
	resize:none;
}
canvas.run { outline-style:solid;outline-color:#a00;outline-width:1px }
textarea.run { background-color:#eee; }

canvas {
	margin-left:12px;
	border:1px solid gray;
	width:320px;
	height:320px;
}
@media only screen and (max-width: 600px) {
	textarea {
		margin-left:0px;
		width:calc(100vw - 28px);
		max-width:480px
	}
	pre.code {
		width:calc(100vw - 28px);
		max-width:480px
	}
	canvas {
		margin-left:0px;
		width:calc(100vw - 28px);
		height:calc(100vw - 28px);
		max-width:480px
	}
	body{
		margin-left:8px;margin-right:8px
	}
}

h3{background-color:#beb;padding:4px;padding-left:12px;margin-bottom:12px}
h3:not(:first-child) { margin-top:24px}

tt {padding:1px;background-color:#dfd;}

button {
  background-color: #dfd;
  cursor: pointer;
  margin: 0px 0px 4px 12px;
  padding: 4px;
  font-size: 110%;
  border:1px solid gray;
  border-radius:5px;
}
button:enabled:hover {background-color:#cec}
button:enabled:active {background-color:#484} 

button.stop { display:none; }

pre i {color: #080}
pre b {color: #821}
hr {margin-top:30px;margin-bottom:30px;}

span.high {background-color:#faa}

.flex {
  display: inline-flex;
  flex-wrap: wrap;
}
.vflex {
  display: flex;
  flex-direction: column;
}
`
document.body.appendChild(style)

var phone = window.matchMedia("(max-width: 600px)").matches

var txt_locale = window["txt_locale"]
if (txt_locale == null) txt_locale = ""

var txt_tutor = window["txt_tutor"]
var tut = document.getElementById("tut")

var isInit
var pres
var actBtn
var inp

function showRun() {
	if (actBtn) {
		if (actBtn.out) actBtn.out.className = ""
		if (actBtn.canv) actBtn.canv.className = ""
	}
	for (var i = 0; i < pres.length; i++) {
		pres[i].btn.stop.style.display = "none"
		pres[i].btn.disabled = false
	}
	actBtn = null
}

function tutMsgFunc(msg, d) {
	if (msg == "stopped") {
		showRun()
	}
	else if (msg == "ready") {
		if (!isInit) {
			tutUpd()
			isInit = true
		}
		else {
			showRun()
		}
	}
	else if (msg == "src_nl") {
		gotSrcNl(d[0], d[1], d[2], d[3])
	}
	else if (msg == "src") {
		actBtn.pre.innerHTML = d[0]
	}
	else if (msg == "src_err") {
		gotSrcErr(d[0], d[1], d[2], d[3])
	}
	else if (msg == "src2") {
		pres[d[1]].innerHTML = d[0]
	}
	else if (msg == "input") {
		input = create("input")
		input.setAttribute("type", "text");
		input.style.marginLeft = "12px"
		actBtn.parentElement.appendChild(input)
		input.focus()
		input.onkeydown = function(e) {
			var k = e.keyCode
			if (k == 13 || k == 68 && e.ctrlKey) {
				if (k == 13) easyinp(input.value)
				else easyinp(null)
				input.remove()
				input = null
				e.preventDefault()
			}
		}
	}
	else if (msg == "selline") {
		selectLine(d[0])
	}
	else if (msg == "nowasm") {
		tut.innerHTML = "<b>Sorry. This tutorial needs WebAssembly support in your browser.</b>"
	}
}

function canvClear(canv) {
	var c = canv.getContext("2d")
	c.clearRect(0, 0, canv.width, canv.height)
}

var input

function restart() {
	if (input) {
		input.remove()
		input = null
	}
	kaStop()
}

function tutUpd() {
	while (tut.firstChild) tut.removeChild(tut.firstChild)
	var lang = navigator.language.substring(0, 2)
	if (txt_locale.indexOf(lang) == -1) lang = ""
	lang += " "
	pres = []
	var splitStr = "\n\n"
	if (window.txt_split) splitStr = txt_split
	var smpls = txt_tutor.split(splitStr)
	if (smpls[0].charAt(0) === "\n") smpls[0] = smpls[0].slice(1)
	var k = lang.length + 1
	for (var i = 0; i < smpls.length; i++) {
		var s = smpls[i]
		if (s.startsWith("*")) {
			if (s.startsWith("*" + lang)) {
				var b = create("h3")
				b.appendChild(document.createTextNode(s.substring(k)))
				tut.appendChild(b)
			}
		}
		else if (s.startsWith("+")) {
			if (s.startsWith("+" + lang)) {
				var b = create("p")
				var s0 = s.substring(k)
				var sn = ""
				var st = true
				for (var h = 0; h < s0.length; h++) {
					var c = s0[h]
					if (c == "*") {
						if (s0[h + 1] == "*") {
							sn += c
							h++
						}
						else {
							if (st) sn += "<tt>"
							else sn += "</tt>"
							st = !st
						}
					}
					else if (c == "<") sn += "&lt;"
					else sn += c
				}
				b.innerHTML = sn
				tut.appendChild(b)
			}
		}
		else if (s == "-") tut.appendChild(create("hr"))
		else if (s.startsWith("@")) {
			if (s.startsWith("@" + lang)) {
				var ar  = s.substring(k).split("@")
				var p = create("p")
				var link = create("a")
				link.href = ar[0]
				link.target = "_blank"
				link.appendChild(document.createTextNode(ar[1]))
				p.appendChild(link)
				tut.appendChild(p)
			}
		}
		else if (s.startsWith("##")) {
			var ca = create("canvas")
			ca.tabindex = 0
			ca.style.marginBottom = "12px"
			ca.style.border = "0px"
			if (s[2] != "\n") {
				var h = Number(s.substring(2, 4))
				ca.width = 800
				ca.height = 8 * h
				ca.style.height = h * 3.2 + "px"
			}
			var c = ca.getContext("2d")
			c.clearRect(0, 0, 800, 800)
			tut.appendChild(ca)
			easyrun(s, ca)
		}
		else if (s.startsWith("~")) {
			var b = create("pre")
			b.appendChild(document.createTextNode(s.substring(k)))
			tut.appendChild(b)
		}
		else {
			var pre = create("pre")
			pre.className = "code"
			pre.innerHTML = s
			pre.contentEditable = true

			pre.autocorrect = false
			pre.autocomplete = false
			pre.autocapitalize = false
			pre.spellcheck = false

			pre.onkeydown = function(e) {
				preKey(this, e)
			}
			kaFormat(s, pres.push(pre) - 1)

			var out = null
			var canv = null
			if (s.search("move_pen ") != -1 || s.search("set_color ") != -1) {
				if (!phone) pre.style.minHeight = "346px"
				canv = create("canvas")
				canv.style.backgroundColor = "#f8f8f8"
				canv.width = 800
				canv.height = 800
				canvClear(canv)
			}
			if (s.search("print ") != -1) {
				out = create("textarea")
				out.readOnly = true
			}

			var btn = create("button")
			btn.innerHTML = "Run"
			btn.onclick = function() {
				runClick(this)
			}
			var btn2 = create("button")
			btn2.innerHTML = "Stop"
			btn2.className = "stop"
			btn2.onclick = function() {
				restart()
			}
			var flex = create("div")
			flex.className = "flex"

			var div
			div = create("div")
			div.appendChild(pre)
			flex.appendChild(div)

			div = create("div")

			d = create("div")
			d.className = "vflex"

			d2 = create("div")
			d2.appendChild(btn)
			d2.appendChild(btn2)
			d.appendChild(d2)

			if (canv) d.appendChild(canv)
			if (out) d.appendChild(out)

			div.append(d)
			flex.appendChild(div)

			tut.appendChild(flex)

			btn.stop = btn2
			btn.pre = pre
			pre.btn = btn
			btn.out = out
			btn.canv = canv
			if (out) {
				if (phone || canv) {
					if (!phone) pre.style.minHeight = "448px"
					out.rows = 5
				}
				else {
					out.style.height = (pre.offsetHeight - btn.offsetHeight - 8) + "px"
				}
			}
		}
	}

	if (window.hook) {
		hook()
	}
}

// ------------------

var tailSrc
var cnd = create("span")
cnd.act = false
cnd.err = false
appendTxt(cnd, " ")
cnd.className = "high"

function caret(nd, n) {
	var r = document.createRange()
	r.setStart(nd, n)
	r.setEnd(nd, n)
	var sel = window.getSelection()
	sel.removeAllRanges()
	sel.addRange(r)
}

function removeCnd() {
	if (cnd.act) {
		cnd.act = false
		if (document.contains(cnd)) {

			var n1 = cnd.previousSibling
			var n2 = cnd.nextSibling

			var s = n1.nodeValue + n2.nodeValue
			var p = cnd.parentNode
			p.removeChild(n1)
			p.removeChild(n2)
			var nd = document.createTextNode(s)
			p.insertBefore(nd, cnd)
			caret(nd, n1.nodeValue.length)

			cnd.parentNode.removeChild(cnd)
		}
		if (cnd.err) {
			cnd.firstChild.nodeValue = " "
			cnd.err = false
		}
	}
}
function getCaret() {
	var sel = window.getSelection()
	if (!sel || sel.anchorNode == inp) return 0
	var pos = 0
	for (var i = 0; i < inp.childNodes.length; i++) {
		var nd = inp.childNodes[i]
		while (nd.nodeType == Node.ELEMENT_NODE && nd.childNodes.length > 0) nd = nd.childNodes[0]
		if (nd == sel.anchorNode) {
			pos += sel.anchorOffset
			break
		}
		if (nd.length != null) pos += nd.length;  // chrome
	}
	return pos
}

function setCaret(pos) {
	if (pos < 0) return
	var nd, i
	for (i = 0; i < inp.childNodes.length; i++) {
		nd = inp.childNodes[i]
		while (nd.nodeType == Node.ELEMENT_NODE && nd.childNodes.length > 0) nd = nd.childNodes[0]
		if (nd.length > pos) break
		pos -= nd.length
	}
	if (i == inp.childNodes.length) pos = nd.length

	var p = nd.parentNode

	var n = document.createTextNode(nd.nodeValue.substr(0, pos))
	p.insertBefore(n, nd)
	cnd.act = true
	p.insertBefore(cnd, nd)
	n = document.createTextNode(nd.nodeValue.substr(pos))
	p.insertBefore(n, nd)
	p.removeChild(nd)

	caret(n, 0)
}

function scrollToLine(lc, nln) {
	var lpp = nln * inp.clientHeight / inp.scrollHeight
	var ltop = nln * inp.scrollTop / inp.scrollHeight
	if (lc < ltop || lc > ltop + lpp - 1) {
		inp.scrollTop = (lc - 1) * inp.scrollHeight / nln
	}
}

function selectLine(l) {
	var sel = window.getSelection()
	sel.removeAllRanges()
	if (l == 0) return;
	l--
	var lines = inp.innerText.split("\n")
	var lc = l
	var ln = lines.length
	var a = 0
	for (var x = 0; x < ln; x++) {
		if (x == l) break
		a += lines[x].length + 1
	}
	var b = lines[l].length + a

	var caret0 = -1
	var caret = a
	var nd0, nd, i
	for (i = 0; i < inp.childNodes.length; i++) {
		nd = inp.childNodes[i]
		if (nd.nodeType == Node.ELEMENT_NODE) nd = nd.childNodes[0]
		if (nd.length > caret) {
			if (caret0 != -1) break
			caret0 = caret
			nd0 = nd
			caret += b - a
			i--
			continue
		}
		caret -= nd.length
	}
	if (caret0 != -1) {
		var r = document.createRange()
		r.setStart(nd0, caret0)
		r.setEnd(nd, caret)
		sel.addRange(r)
	}
	scrollToLine(lc, ln)
}

function scrollToPos(pos) {
	var lines = inp.innerText.split("\n")
	var ln = lines.length
	var a = 0
	var lc
	for (lc = 0; lc < ln; lc++) {
		a += lines[lc].length + 1
		if (a > pos) break
	}
	scrollToLine(lc, ln)
}

function showError(err, pos) {
	cnd.firstChild.nodeValue = " " + err + " "
	cnd.err = true
	scrollToPos(pos)
	inp.focus()
}

function gotSrcNl(src, res, pos, err) {
	inp.innerHTML = src.substr(0, res)
	appendTxt(inp, src.substr(res) + tailSrc)
	setCaret(pos)
	if (err) showError(err, pos)
	else if (tailSrc.length < 10) {
		inp.scrollTop = inp.scrollHeight - inp.clientHeight
	}
}
	
function gotSrcErr(src, res, pos, err) {
	inp.innerHTML = src.substr(0, res)
	appendTxt(inp, src.substr(res))
	showRun()
	setCaret(pos)
	showError(err, pos)
}

// ------------------

function preKey(pre, e) {
	inp = pre
	var k = e.keyCode
	if (cnd.act) {
		removeCnd()
		if (k == 8) {
			e.preventDefault()
			return
		}
	}
	if (e.ctrlKey) {
		if (k == 82 || k == 13) {
			runClick(pre.btn)
			e.preventDefault()
		}
	}
	else if (k == 9) {
		document.execCommand("insertHTML", false, "\n")
		e.preventDefault()
	}
	else if (k === 13) {
		if (actBtn) {
			e.preventDefault()
			restart()
			return
		}
		var p = getCaret()
		var inps = inp.innerText
		if (p != 0 && inps[p - 1] != "\n") {
			while (p < inps.length && inps[p] != "\n") p++
		}
		var s =inps.substring(0, p)
		tailSrc = inps.substring(p)
		if ((s.length == 0 || s[s.length - 1] == "\n") && tailSrc[0] != "\n") {
			tailSrc = "\n" + tailSrc
		}
		kaFormat(s)
		e.preventDefault()
	}
}

function runClick(btn) {
	if (btn.disabled) return
	actBtn = btn
	inp = btn.pre
	removeCnd()
	setTimeout(function() { 
			if (actBtn != null) {
				for (var i = 0; i < pres.length; i++) {
					pres[i].btn.stop.style.display = "inline"
				}
			}
		}, 1000);
	for (var i = 0; i < pres.length; i++) {
		pres[i].btn.disabled = true
	}
	tailSrc = null
	if (btn.canv) {
		btn.canv.className = "run"
		canvClear(btn.canv)
	}
	if (btn.out) btn.out.className = "run"
	easygo(btn.pre.innerText, btn.canv, btn.out)
}

window.addEventListener("keydown", function(e) {
	if (e.keyCode == 82 && e.ctrlKey || e.keyCode == 116) {
		e.preventDefault()
	}
})

easyinit(null, null, tutMsgFunc)

