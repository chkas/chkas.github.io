var CACHE = 'r0925-1424'
var VERS = '181'
var urls = [
	"/run/",
	"/run/easyw" + VERS + ".wasm",
	"/run/easyw" + VERS + ".js",
	"/run/icon.png",
	"/run/mfst.json",
]

console.log("sw " + CACHE)

self.addEventListener("install", evt => {
	console.log("install")
	evt.waitUntil(
		caches.open(CACHE).then(cache => Promise.all(
			urls.map(url => {
				var f = url
				if (f == "/run/") f += "?" + CACHE
				return fetch(f).then(resp => {
					if (!resp.ok) {
						console.log(f + " missing")
						return
					}
					return cache.put(url, resp)
				})
			})
		))
	)
})

self.addEventListener("fetch", evt => {
	evt.respondWith(async function() {
		var cache = await caches.open(CACHE)
		var res = await cache.match(evt.request, {ignoreSearch: true})
		if (res) return res
		console.log("fetch " + evt.request.url)
		return fetch(evt.request.url)
	}())
})

self.addEventListener("activate", function(evt) {
	evt.waitUntil(
		caches.keys().then(function(keys) {
			return Promise.all(
				keys.map(function(k) {
					if (k != CACHE && k[0] == CACHE[0]) return caches.delete(k)
				})
			)
		})
	)
})

self.addEventListener("message", function (evt) {
	if (evt.data.action == "skipWaiting") self.skipWaiting()
})
