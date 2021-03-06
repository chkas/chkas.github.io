const WORKER = "easyw.js"
/*	easy.js

	Copyright (c) Christof Kaser christof.kaser@gmail.com. 
	All rights reserved.

	This work is licensed under the terms of the GNU General Public 
	License version 3. For a copy, see http://www.gnu.org/licenses/.

    A derivative of this software must contain the built-in function 
    sysfunc "created by" or an equivalent function that prints
    "christof.kaser@gmail.com".
*/

window["kaRun"] = kaRun
window["kaFormat"] = kaFormat
window["kaStop"] = kaStop
window["easykey"] = easykey
window["easyrun"] = easyrun
window["easygo"] = easygo
window["easyinit"] = easyinit
window["easyinp"] = easyinp

var eProg = []
var initState = 0
var eCan = null
var eOut = null
var eFunc = null
var isRunning

function setCanv(ca) {
	eCan = ca
	if (!ca) return
	eCan.on = false
	if (eCan.width == 300 && eCan.height == 150) {
		eCan.width = 800
		eCan.height = 800
	}
}

function easygo(prog, canv = null, out = null) {
	setCanv(canv)
	if (canv) canvInit()
	eOut = out
	if (out) eOut.value = ""
	isRunning = true
	worker.postMessage(["run", prog, 2, -1, null])
}
function easyrun(prog, ca = null, args = null) {
	eProg.push([prog, ca, args])
	if (initState == 0) {
		easyinit(eProg[0][1])
	}
	if (initState < 2) return;
	if (eCan && eCan.on) kaStop()
	else tryrun()
}
function tryrun() {
	if (isRunning) return
	if (eProg.length != 0) {
		var args = null
		var h = eProg.shift()
		if (h.length > 1) setCanv(h[1])
		if (h.length > 2) args = h[2]
		canvInit()
		isRunning = true
		worker.postMessage(["runx", h[0], 0, -1, args])
	}
}
function msgFunc(msg, d = null) {
	if (eFunc) eFunc(msg, d)
}

function canvInit() {
	canvSetOff()
	c = eCan.getContext("2d")
	textsize(8)
	linewidth(1)
	// set color
	sys(3)
	c.px = 0
	c.py = 0
	c.backImg = null
	c.backColor = null
	c.setTransform(1,0,0,1,0,0)
	c.translate(0.04, 0.04);
	c.scale(8, 8);
}

var doTrace = false

function kaRun(s, args = null, opt = 0, pos = -1) {
	eCan = canv0
	if (eCan) canvInit()
	doTrace = false
	if (opt > 255) {
		imgTrace = null
		doTrace = true
	}
	isRunning = false
	worker.postMessage(["run", s, opt, pos, args])
}
function kaFormat(s, id = null) {
	if (id == null) {
		worker.postMessage(["format", s])
	}
	else {
		if (worker) worker.postMessage(["formatID", s, id ])
	}
}

function canvStop() {
	worker.terminate()
	startWorker()
}

var canvStopT

function kaStop() {
	audStop()
	if (eCan && eCan.on) {
		worker.postMessage(["stop_ping"])
		canvSetOff()
		canvStopT = setTimeout(canvStop, 500)
	}
	else {
		worker.terminate()
		startWorker()
	}
}

var c = null

function cancelTimer() {
	if (eCan.timer) {
		clearTimeout(eCan.timer)
		eCan.timer = null
	}
}
function canvSetOff() {
	if (eCan && eCan.on) {
		eCan.on = false
		eCan.onmouseout = null
		eCan.onmousedown = null
		eCan.onmouseup = null
		eCan.onmousemove = null
		eCan.ontouchmove = null
		eCan.ontouchstart = null
		eCan.ontouchend = null
		eCan.removeEventListener("keydown", _keydown)
		eCan.removeAttribute("tabIndex");
		if (eCan.aniFrame) {
			cancelAnimationFrame(eCan.aniFrame)
			eCan.aniFrame = null
		}
		cancelTimer()
		eCan.style.cursor = "default"
	}
}
function circ(x, y, w) {
	c.beginPath()
	c.arc(x, y, w, 0, 2 * Math.PI)
	c.fill()
}
function line(x, y) {
	c.beginPath()
	c.moveTo(c.px, c.py)
	c.lineTo(x, y)
	c.stroke()
	circ(c.px, c.py, c.lineWidth / 2)
	circ(x, y, c.lineWidth / 2)
	c.px = x
	c.py = y
}
function color(r, g, b) {
	var col = "rgb(" + r + "," + g + "," + b + ")"
	c.fillStyle = col
	c.strokeStyle = col
}
function textsize(sz) {
	c.font="" + Math.round(sz) + "px monospace"
	c.txtY = sz * 5 / 6
}
function linewidth(w) {
	c.lineWidth = w
}
function curve(l) {
	if (l.length < 2) return
	var x = l[0][0]
	var y = l[0][1]
	circ(x, y, c.lineWidth / 2)
	c.beginPath()
	c.moveTo(x, y)
	if (l.length == 2) {
		var xn = l[1][0]
		var yn = l[1][1]
		c.lineTo(x, y)
	}
	else {
		var i = 1
		while (true) {
			x = l[i][0]
			y = l[i][1]
			xn = l[i + 1][0]
			yn = l[i + 1][1]
			if (i == l.length - 2) break
			c.quadraticCurveTo(x, y, (x + xn) / 2, (y + yn) / 2);
			i += 1
		}
		c.quadraticCurveTo(x, y, xn, yn)
	}
	c.stroke()
	circ(xn, yn, c.lineWidth / 2)
}
function polyg(l) {
	if (l.length < 2) return
	c.beginPath()
	c.moveTo(l[0][0], l[0][1])
	for (var i = 1; i < l.length; i++) {
		c.lineTo(l[i][0], l[i][1])
	}
	c.fill()
}
function sys(n) {
	if (n == 1) {
		// clear
		c.save()
		c.setTransform(1,0,0,1,0,0)
		if (c.backImg) c.putImageData(c.backImg, 0, 0)
		else if (c.backColor) {
			c.fillStyle = c.backColor
			c.fillRect(0, 0, 800, 800)
		}
		else c.clearRect(0, 0, 800, 800)
		c.restore()
	}
	else if (n == 2) {
		// set image background
		c.save()
		c.setTransform(1,0,0,1,0,0)
		c.backImg = c.getImageData(0, 0, 800, 800)
		c.backColor = null
		c.restore()
	}
	else if (n == 3) {
		// color -1
		var col = window.getComputedStyle(eCan, null).color
		c.fillStyle = col
		c.strokeStyle = col
	}
	else if (n == 4) {
		// color -2
		var nd = eCan
		while (true) {
			var h = window.getComputedStyle(nd, null).backgroundColor
			if (h.startsWith("rgb(")) break
			nd = nd.parentNode
			if (nd == null) {
				h = "rgb(0,0,0)"
				break
			}
		}
		c.fillStyle = h
		c.strokeStyle = h
	}
	else {
		console.log("** sys " + n + " not handled")
	}
}

var imgTrace

function grafCommand(d) {
	switch (d[0]) {
	case 1:
		c.px = d[1]
		c.py = d[2]
		break
	case 2:
		line(d[1], d[2])
		break
	case 3:
		c.beginPath()
		c.arc(c.px, c.py, d[1], 0, 2 * Math.PI)
		c.fill()
		break
	case 4:
		c.fillRect(c.px, c.py, d[1], 1 * d[2])
		break
	case 5:
		polyg(d[1])
		break
	case 6:
		c.fillText(d[1], c.px, c.py + c.txtY)
		break
	case 7:
		sys(d[1])
		break
	case 8:
		linewidth(d[1])
		break
	case 9:
		color(d[1], d[2], d[3])
		break
	case 10:
		textsize(d[1])
		break
	case 11:
		if (eCan.on) {
			if (d[1] < cursors.length) eCan.style.cursor = cursors[d[1]]
		}
		break
	case 12:
		curve(d[1])
		break
	case 13:
		c.translate(d[1], d[2])
		break
	case 14:
		c.rotate(d[1])
		break
	case 15:
		c.backColor = "rgb(" + d[1] + "," + d[2] + "," + d[3] + ")";
		c.backImg = null
		break
	case 16:
		c.beginPath()
		c.arc(c.px, c.py, d[1], d[2] * Math.PI / 180, d[3] * Math.PI / 180)
		c.fill()
		break
	}
}

var cursors = [ "default", "crosshair", "pointer" ]

function grafList(cmds) {
	if (cmds.length == 1) {
		var d = cmds[0]
		if (doTrace && d[0] <= 7) {
			if (imgTrace) {
				c.putImageData(imgTrace, c.px * 8 - 8, c.py * 8 - 8)
			}
		}
		grafCommand(d)
		if (doTrace && d[0] <= 7) {
			imgTrace = c.getImageData(c.px * 8 - 8, c.py * 8 - 8, 16,  16)
			var f = c.fillStyle
			c.fillStyle = "red"
			c.beginPath()
			c.arc(c.px, c.py, 1, 0, 2 * Math.PI)
			c.fill()
			c.fillStyle = f
		}
	}
	else {
		for (var i = 0; i < cmds.length; i++) {
			grafCommand(cmds[i])
		}
	}
}

var aud = null
var sound_vals

function audStop() {
	if (aud) {
		aud.close()
		if (aud.timer) clearTimeout(aud.timer)
		aud = null
	}
}

function soundNext() {
	var h = sound_vals.shift()
	var msec = h[1] * 1000
	aud.osc.frequency.setValueAtTime(h[0], aud.currentTime)
	aud.gain.gain.setTargetAtTime(1, aud.currentTime, 0.01)
	aud.timer = setTimeout(soundDone, msec)
}

function soundDone() {
	aud.gain.gain.setTargetAtTime(0, aud.currentTime, 0.05)
	if (sound_vals.length != 0) {
		aud.timer = setTimeout(soundNext, 150)
	}
}

function initAudio() {
	var AudioContext = window.AudioContext || window.webkitAudioContext
	aud = new AudioContext()
	aud.osc = aud.createOscillator()
	aud.gain = aud.createGain()
	aud.gain.gain.setValueAtTime(0, aud.currentTime)
	aud.osc.connect(aud.gain)
	aud.gain.connect(aud.destination)
	aud.osc.start()
}

function sound(vals) {
	if (!aud) initAudio();
	if (aud.timer) {
		clearTimeout(aud.timer)
		aud.gain.gain.setTargetAtTime(0, aud.currentTime, 0.05)
	}
	sound_vals = vals
	if (sound_vals.length != 0) soundNext()
}

var isMouseDown = false

function canvMouseDown(e) {
	var r = eCan.getBoundingClientRect()
	isMouseDown = true
	var sc = eCan.width / r.width / 8
	worker.postMessage(["mouse", 0, 
			(e.clientX - r.left) * sc, (e.clientY - r.top) * sc ])
	eCan.focus()
	e.preventDefault()
}

function canvTouchStart(e) {
	lastTouch = e.touches[0]
	e.clientX = lastTouch.clientX
	e.clientY = lastTouch.clientY
	canvMouseDown(e)
}

function canvMouseUp(e) {
	var r = eCan.getBoundingClientRect()
	isMouseDown = false
	var sc = eCan.width / r.width / 8
	worker.postMessage(["mouse", 1, 
			(e.clientX - r.left) * sc, (e.clientY - r.top) * sc ])
	e.preventDefault()
}
function canvMouseMove(e) {
	var r = eCan.getBoundingClientRect()
	var sc = eCan.width / r.width / 8
	worker.postMessage(["mouse", 2,
			(e.clientX - r.left) * sc, (e.clientY - r.top) * sc ])
	e.preventDefault()
}

function workerStarted() {
	window["sab"] = null
	if (typeof SharedArrayBuffer == "function") {
		window["sab"] = new SharedArrayBuffer(112)
	}
	worker.postMessage(["init", window["sab"], navigator.language.substring(0, 2)])

	if (initState == 1) loadInfo(null)
	initState = 2
	isRunning = false
	tryrun()
	msgFunc("ready")
}

function print(s) {
	if (eOut) {
		var so = eOut.value
		if (so.length > 60000) so = so.substr(1000)
		eOut.value = so + s
		eOut.scrollTop = eOut.scrollHeight
	}
	else {
		console.log(s)
	}
}

function actAudio() {

	if (!aud) initAudio()
	else {
		aud.resume()
		if (aud.state == "running") {
			eCan.removeEventListener("mousedown", actAudio)
			eCan.removeEventListener("touchstart", actAudio)
			eCan.removeEventListener("touchend", actAudio)
		}
	}
}

var lastTouch
function workerMessage(event) {
	var d = event.data
	var cmd = d[0]
	switch (cmd) {
	case "list":
		grafList(d[1])
		break
	case "print":
		print(d[1])
		break
	case "ide":
		d.shift()
		var msg = d.shift()
		msgFunc(msg, d)
		break
	case "stderr":
		console.log(d[1])
		break
	case "started":
		console.log("started")
		workerStarted()
		break
	case "done": 
		if (doTrace && imgTrace) {
			c.putImageData(imgTrace, c.px * 8 - 8, c.py * 8 - 8);
		}
		isRunning = false
		canvSetOff()
		msgFunc("stopped")
		tryrun()
//?
//		if (eCan && eCan.on) canvInit()
		break
	case "stop_pong":
//?
//		canvInit()
		clearTimeout(canvStopT)
		isRunning = false
		msgFunc("stopped")
		tryrun()
		break
	case "sound": 
		sound(d[1])
		break
	case "timer":
		if (eCan.on) setTimer(d[1])
		break
	case "init":
		if ((d[1] & 32) == 0) break
		if (!eCan) {
			console.log("no canvas")
			worker.terminate()
			msgFunc("info", [0])
			startWorker()
			return
		}
		msgFunc("canvon")
		eCan.on = true
		if (d[1] & 15) {
			eCan.focus()
			if (d[1] & 1) {
				eCan.onmousedown = canvMouseDown
				eCan.ontouchstart = canvTouchStart
			}
			if (d[1] & 2) {
				eCan.onmouseup = canvMouseUp
				eCan.ontouchend = function(e) {
					e.clientX = lastTouch.clientX
					e.clientY = lastTouch.clientY
					canvMouseUp(e)
				}
				eCan.onmouseout = function(e) {
					if (isMouseDown) {
						e.clientX = 0
						e.clientY = 0
						canvMouseUp(e)
					}
				}
				if ((d[1] & 4) == 0) {
					eCan.ontouchmove = function(e) {
						lastTouch = e.touches[0]
					}
				}
			}
			if (d[1] & 4) {
				eCan.onmousemove = canvMouseMove
				eCan.ontouchmove = function(e) {
					lastTouch = e.touches[0]
					e.clientX = lastTouch.clientX
					e.clientY = lastTouch.clientY
					canvMouseMove(e)
				}
			}
			if (d[1] & 8) {
				eCan.addEventListener("keydown", _keydown, false)
				eCan.tabIndex = 0
			}
		}
		if (d[1] & 16) {
			if (!eCan.aniFrame) {
				eCan.aniFrame = requestAnimationFrame(animate)
			}
		}
		if (d[1] & 64) {
			eCan.addEventListener("mousedown", actAudio)
			eCan.addEventListener("touchstart", actAudio)
			eCan.addEventListener("touchend", actAudio)
		}
		break
	case "exit":
		canvSetOff()
		audStop()
		worker.terminate()
		msgFunc("info", [0])
		startWorker()
		break
	case "error":
		isRunning = false
		msgFunc("error")
		break
	default:
		console.log("unknown command: " + d);
	}
}

function startWorker() {
	worker = new Worker(WORKER)
	worker.onmessage = workerMessage
}

function timer() {
	worker.postMessage(["timer"])
}

function setTimer(s) {
	cancelTimer()
	if (s >= 0) eCan.timer = setTimeout(timer, 1000 * s)
}

function animate() {
	worker.postMessage(["animate"])
	eCan.aniFrame = requestAnimationFrame(animate)
}

function _keydown(e) {
	worker.postMessage(["key", e.key])
	e.preventDefault()
}
var worker = null
var canv0 = null

function loadInfo(s) {
	if (eOut) {
		if (s) print(s + "\n")
		else eOut.value = ""
	}
	else if (eCan) {
		if (s) {
			canvInit()
			c.fillText(s, 10, 10)
		}
		else if (c) sys(1)
	}
}

function easyinit(ca, out = null, msg_func = null) {
	eOut = out
	eFunc = msg_func
	canv0 = ca
	setCanv(ca)
	if (typeof WebAssembly != "object") {
		loadInfo("no wasm support")
		msgFunc("nowasm")
	}
	else {
		startWorker()
		setTimeout(function() { 
			if (initState == 1) loadInfo("Loading ...")
		}, 1000);
	}
	initState = 1
}

function easykey(s) {
	worker.postMessage(["key", s])
}

function easyinp(s) {
	var vw = new Uint16Array(window["sab"])
	if (s) {
		vw[4] = s.length + 1
		for (var i = 0; i < s.length; i++) {
			vw[i + 5] = s.charCodeAt(i)
		}
	}
	else {
		vw[4] = 0
	}
	vw = new Int32Array(window["sab"])
	Atomics.store(vw, 1, 1)
	if (Atomics.notify) Atomics.notify(vw, 1, 1)
	else Atomics.wake(vw, 1, 1)
}

if (window["easyscript"]) {
	var ca = window["easycanv"]
	if (!ca) ca = document.querySelector("canvas")
	easyrun(window["easyscript"], ca)
}

