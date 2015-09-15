require('fontfaceobserver')
var Editable = require('contenteditable')
var record = require('./record.es')
var clock = require('./clock.es')
var hasClass = require('./hasClass.es')
var contentEditable = document.querySelectorAll('[contenteditable]')
var elScale = document.querySelectorAll('.js-scaleText')
var elDropcap = document.querySelectorAll('.js-dropcap')

var scaleText = function (elScale) {
  bigIdeasText(elScale, {
    maxfontsize: 300,
    minfontsize: 30
  })
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

var editablePaste = function (e) {
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

var observer = new FontFaceObserver('Moriston')

observer
  .check()
  .then(function () {
    console.log('Moriston is available!')
    scaleText(elScale)
    editableInit()
  }, function () {
    console.log('Moriston is not available')
  })

record()
clock()
