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
