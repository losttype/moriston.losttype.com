require('fontfaceobserver')
var Editable = require('contenteditable')
// var record = require('./_record.js')
var clock = require('./_clock.js')
var hasClass = require('./_hasClass.js')
var contentEditable = document.querySelectorAll('[contenteditable]')
var elScale = document.querySelectorAll('.js-scaleText')
var bigIdeasText = require('big-ideas-text')

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
  if (hasClass(editable.element, 'is-editable')) {
    editable.element.onfocus = function (asdf) {
      editable.element.classList.remove('is-editable')
    }
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
    if (e.type === 'paste') {
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

var observers = [
  new FontFaceObserver('Moriston', { weight: 300 }).check(),
  new FontFaceObserver('Moriston', { weight: 400 }).check(),
  new FontFaceObserver('Moriston', { weight: 500 }).check(),
  new FontFaceObserver('Moriston', { weight: 600 }).check(),
  new FontFaceObserver('Moriston', { weight: 700 }).check(),
  new FontFaceObserver('Moriston', { weight: 900 }).check()
]

if (window.Promise) {
  Promise.all(observers).then(function () {
    scaleText(elScale)
    editableInit()
  }, function (err) {
    console.log('Moriston is not available')
    console.warn(err)
  })
} else {
  window.setTimeout(function () {
    scaleText(elScale)
    editableInit()    
  }, 1000)
}

// record()
clock()
