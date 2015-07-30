var fitterHappierText = require('fitter-happier-text')
var fontfaceobserver = require('fontfaceobserver')
var Editable = require('contenteditable')

var contentEditable = document.querySelectorAll('[contenteditable]')
var fitterHappierPaddingY = 3

var fitterHappier = function(nodes) {
  console.log(nodes)
  fitterHappierText(nodes, { paddingY: fitterHappierPaddingY, baseline: 14 })
}

// TODO
// Right now, simply calling fitterHappier() again on the [contenteditable]
// parent nodes doesn’t seem to cut it… instead maybe only re-calc the math
// for this specific part from fitter-happier-text?
// ie. update the width and height attrs, but that’s it?
// From: https://github.com/jxnblk/fitter-happier-text/blob/master/index.js#L44-L45
var fitterHappierAgain = function(el, options) {
  var options = options || {};
  var paddingY = options.paddingY || 0;
  var svg = el.firstChild
  var text = svg.firstChild
  console.log('svg', svg)
  var width = text.offsetWidth || text.getComputedTextLength()
  var height = text.offsetHeight || 24

  svg.setAttribute('viewBox', '0 0 ' + width + ' ' + (height + paddingY));
}

var editableEvents = function(el) {
  var editable = new Editable(el)
  editable.enable()
  editable.on('state', function (e) {
    console.log('e', e)
    e.preventDefault()
    fitterHappierAgain(el, { paddingY: fitterHappierPaddingY })
  })
}

var editableInit = function() {
  for (var index in contentEditable) {
    if (contentEditable.hasOwnProperty(index)) {
      editableEvents(contentEditable[index])
    }
  }
}

var nodes = document.querySelectorAll('.js-fitterHappier')
var observer = new FontFaceObserver('Moriston')
var observerRegular = new FontFaceObserver('Moriston', {
  weight: 400
})

observerRegular
  .check()
  .then(function () {
    console.log('Moriston regular is available');

    // Load remainder of family
    observer
      .check()
      .then(function () {
        console.log('Loaded remainder of Moriston!')
        fitterHappier(nodes)
        editableInit()
      }, function () {
        console.log('Remainder of font is not available');
      })

  }, function () {
    console.log('Font is not available');
  })
