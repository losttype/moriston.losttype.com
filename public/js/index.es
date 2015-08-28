var fitterHappierText = require('fitter-happier-text')
require('fontfaceobserver')
var Editable = require('contenteditable')

var contentEditable = document.querySelectorAll('[contenteditable]')
var nodes = document.querySelectorAll('.js-fitterHappier')
var fitterHappierPaddingY = 3

var fitterHappier = function (nodes) {
  bigIdeasText(nodes, { maxfontsize: 250, minfontsize: 30 })
}

// TODO
// Right now, simply calling fitterHappier() again on the [contenteditable]
// parent nodes doesn’t seem to cut it… instead maybe only re-calc the math
// for this specific part from fitter-happier-text?
// ie. update the width and height attrs, but that’s it?
// From: https://github.com/jxnblk/fitter-happier-text/blob/master/index.js#L44-L45
var fitterHappierAgain = function (el, options) {
  options = options || {}
  var paddingY = options.paddingY || 0
  var svg = el.firstChild
  var text = svg.firstChild
  var widthComputed = text.offsetWidth || text.getComputedTextLength()
  var widthMax = 42
  var height = text.offsetHeight || 24


  if (widthComputed <= widthMax) {
    return false
  } else {
    return svg.setAttribute('viewBox', '0 0 ' + widthComputed + ' ' + (height + paddingY))
  }
}

var editableEvents = function (el) {
  var editable = new Editable(el)
  editable.enable()
  editable.on('change', function (e) {
    // console.log(el.innerText)
    fitterHappier(el)
    // fitterHappierAgain(el, { paddingY: fitterHappierPaddingY })
    // if (el.innerText === '' && el.hasChildNodes() === true) {
    //   el.children[0].children[0].innerHTML = 'Try me…'
      // console.log(el.children[0].children[0].innerHTML)
    //   // el.innerText = '…'
    //   fitterHappierAgain(el)
    // }
  })
}

var editableInit = function () {
  for (var index in contentEditable) {
    if (contentEditable.hasOwnProperty(index)) {
      editableEvents(contentEditable[index])
    }
  }
}


var observer = new FontFaceObserver('Moriston')
var observerRegular = new FontFaceObserver('Moriston', {
  weight: 400
})

observerRegular
  .check()
  .then(function () {
    // console.log('Moriston regular is available')

    // Load remainder of family
    observer
      .check()
      .then(function () {
        // console.log('Loaded remainder of Moriston!')

        editableInit()
        fitterHappier(nodes)
      }, function () {
        // console.log('Remainder of font is not available')
      })

  }, function () {
    // console.log('Font is not available')
  })
