require('fontfaceobserver')
var Editable = require('contenteditable')
var contentEditable = document.querySelectorAll('[contenteditable]')
var nodes = document.querySelectorAll('.js-scaleText')

var scaleText = function (nodes) {
  bigIdeasText(nodes, { maxfontsize: 250, minfontsize: 30 })
}

var editableEvents = function (el) {
  var editable = new Editable(el)
  editable.enable()
  if (hasClass(editable.element, 'js-scaleText')) {
    editable.on('change', function (e) {
      editablePaste(e)
      scaleText(el)
    })
  }
}

var editableInit = function () {
  for (var index in contentEditable) {
    if (contentEditable.hasOwnProperty(index)) {
      editableEvents(contentEditable[index])
    }
  }
}

var editablePaste = function(e) {
  if (!('-webkit-user-modify' in document.body.style) && !('user-modify' in document.body.style)) {
    if(e.type === 'paste') {
      // Derived from http://stackoverflow.com/a/19327995
      var content = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text')
      if (typeof e.target.innerText !== 'undefined') {
        e.target.innerText = e.target.innerText + content
      } else {
        e.preventDefault()
        e.target.textContent = e.target.textContent + content
      }
    }
  }
}

var hasClass = function(el, className) {
  if (el.classList) {
    return el.classList.contains(className)
  } else {
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className)
  }
}

var clock = function () {
  console.log('start the clock')

	var clockSeconds = document.getElementById('js-clockS')
	var clockMinutes = document.getElementById('js-clockM')
	var clockHours = document.getElementById('js-clockH')

  console.log(clockSeconds)

	function getTime() {

		var date = new Date()
		var seconds = date.getSeconds()
		var minutes = date.getMinutes()
		var hours = date.getHours()

		var degSeconds = seconds * 360 / 60
		var degMinutes = (minutes + seconds / 60) * 360 / 60
		var degHours = (hours + minutes / 60 + seconds / 60 / 60) * 360 / 12

		clockSeconds.setAttribute('style', '-webkit-transform: rotate(' + degSeconds + 'deg); -moz-transform: rotate(' + degSeconds + 'deg); -ms-transform: rotate(' + degSeconds + 'deg); -o-transform: rotate(' + degSeconds + 'deg); transform: rotate(' + degSeconds + 'deg);')
		clockMinutes.setAttribute('style', '-webkit-transform: rotate(' + degMinutes + 'deg); -moz-transform: rotate(' + degMinutes + 'deg); -ms-transform: rotate(' + degMinutes + 'deg); -o-transform: rotate(' + degMinutes + 'deg); transform: rotate(' + degMinutes + 'deg);')
		clockHours.setAttribute('style', '-webkit-transform: rotate(' + degHours + 'deg); -moz-transform: rotate(' + degHours + 'deg); -ms-transform: rotate(' + degHours + 'deg); -o-transform: rotate(' + degHours + 'deg); transform: rotate(' + degHours + 'deg);')
	}

	setInterval(getTime, 1000)
	getTime()
}

var observer = new FontFaceObserver('Moriston')

observer
  .check()
  .then(function () {
    console.log('Moriston is available!')
    scaleText(nodes)
    editableInit()
  }, function () {
    console.log('Moriston is not available')
  })

clock()
