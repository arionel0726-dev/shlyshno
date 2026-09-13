;(function () {
	var script = document.currentScript
	var key = script.getAttribute('data-slyshno-key')
	if (!key) return console.error('[Slyshno] нет data-slyshno-key')
	var origin = new URL(script.src).origin

	var btn = document.createElement('button')
	btn.textContent = '💬'
	btn.setAttribute('aria-label', 'Обратная связь')
	btn.style.cssText =
		'position:fixed;bottom:20px;right:20px;z-index:2147483647;width:52px;height:52px;' +
		'border-radius:50%;border:none;background:#000;color:#fff;font-size:22px;cursor:pointer;' +
		'box-shadow:0 4px 12px rgba(0,0,0,.25)'

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
