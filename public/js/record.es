var Webcam = require('webcamjs')
// var html2canvas = require('../../node_modules/html2canvas/dist/html2canvas.min.js')

module.exports = function() {
  var shutterButton = document.getElementById('js-webcamShutter')
  var shutterRetake = document.getElementById('js-webcamRetake')
  var webcamCamera = document.getElementById('js-webcamCamera')
  var renderFrame = document.getElementById('js-renderFrame')
  var renderResult = document.getElementById('js-renderResult')

  var cameraCancel = function () {
    Webcam.unfreeze()
    shutterRetake.classList.add('is-hidden')
    cameraReady(cameraSave)
  }

  var cameraSave = function () {

    var canvas = webcamCamera.querySelector('canvas')

    html2canvas(renderFrame).then(function(canvas) {

      var img = document.createElement('img')
      img.setAttribute('src', canvas.toDataURL("image/png"))
      document.body.appendChild(img)

      // Then do sharing stuff

      // Put buttons back to default
      cameraReady(cameraSave)
    })
  }

  var cameraPreview = function () {
    Webcam.freeze()

    shutterRetake.classList.remove('is-hidden')
    renderFrame.classList.add('is-preview')
    shutterButton.innerHTML = 'Share cover'
    shutterButton.removeEventListener('click', cameraPreview, false)
    shutterButton.addEventListener('click', cameraSave, false)
  }


  var cameraReady = function (cameraUnset) {
    shutterButton.innerHTML = 'Take photo'
    shutterRetake.classList.add('is-hidden')
    shutterRetake.classList.remove('is-preview')

    shutterButton.removeEventListener('click', cameraUnset, false)
    shutterButton.addEventListener('click', cameraPreview, false)
  }

  var cameraInit = function () {
    var self = this

    Webcam.set({
      width: 480,
      height: 320,
      // flip_horiz: true, // Doing this manually in CSS
      fps: 20
    })

    Webcam.attach('#js-webcamCamera')
    cameraReady(cameraInit)
  }
  shutterButton.addEventListener('click', cameraInit, false)
  shutterRetake.addEventListener('click', cameraCancel, false)
}
