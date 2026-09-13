;(function () {
	var script = document.currentScript
	var key = script.getAttribute('data-slyshno-key')
	if (!key) return console.error('[Slyshno] нет data-slyshno-key')
	var origin = new URL(script.src).origin

	var btn = document.createElement('button')
	btn.setAttribute('aria-label', 'Обратная связь')
	btn.style.cssText =
		'position:fixed;bottom:20px;right:20px;z-index:2147483647;width:52px;height:52px;' +
		'border-radius:50%;border:1px solid rgba(0,0,0,.08);cursor:pointer;' +
		'box-shadow:0 4px 12px rgba(0,0,0,.25);display:flex;align-items:center;' +
		'justify-content:center;padding:0;transition:background .2s,border-color .2s'

	var img = document.createElement('img')
	img.alt = ''
	img.style.cssText = 'width:56px;height:56px;pointer-events:none'
	btn.appendChild(img)

	var mq = window.matchMedia('(prefers-color-scheme: dark)')
	function applyBtnTheme() {
		var dark = mq.matches
		btn.style.background = dark ? '#fff' : '#111'
		btn.style.borderColor = dark ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.08)'
		img.src =
			origin +
			(dark ? '/images/widget-icon-light.png' : '/images/widget-icon-dark.png')
	}
	applyBtnTheme()
	if (mq.addEventListener) mq.addEventListener('change', applyBtnTheme)

	var iframe = document.createElement('iframe')
	iframe.src = origin + '/widget?key=' + encodeURIComponent(key)
	iframe.title = 'Обратная связь'
	iframe.style.cssText =
		'position:fixed;bottom:84px;right:20px;z-index:2147483647;width:360px;height:520px;' +
		'max-height:70vh;border:1px solid #e5e5e5;border-radius:14px;background:#fff;' +
		'box-shadow:0 8px 30px rgba(0,0,0,.2);display:none'

	btn.addEventListener('click', function () {
		iframe.style.display = iframe.style.display === 'none' ? 'block' : 'none'
	})

	function mount() {
		document.body.appendChild(btn)
		document.body.appendChild(iframe)
	}
	if (document.body) mount()
	else document.addEventListener('DOMContentLoaded', mount)

	// Закрытие виджета по сообщению из iframe
	window.addEventListener('message', function (e) {
		if (e.origin !== origin) return
		if (e.data === 'slyshno:close') iframe.style.display = 'none'
	})
})()
