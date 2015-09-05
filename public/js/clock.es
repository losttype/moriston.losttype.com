// Inspired by http://codepen.io/m412c0/pen/bFafi

module.exports = function () {
  var clockContainer = document.getElementById('js-clock')
	var clockSeconds = document.getElementById('js-clockS')
	var clockMinutes = document.getElementById('js-clockM')
	var clockHours = document.getElementById('js-clockH')

	function getTime() {

		var date = new Date()
		var seconds = date.getSeconds()
		var minutes = date.getMinutes()
		var hours = date.getHours()

		var degSeconds = seconds * 360 / 60
		var degMinutes = (minutes + seconds / 60) * 360 / 60
		var degHours = (hours + minutes / 60 + seconds / 60 / 60) * 360 / 12

    if ((hours >= 23 || hours <= 4) && typeof clockContainer.classList !== 'undefined') {
      clockContainer.parentNode.parentNode.classList.add('knockout', 'knockout--purple')
    } else {
      clockContainer.parentNode.parentNode.classList.remove('knockout', 'knockout--purple')
    }

		clockSeconds.setAttribute('style', '-webkit-transform: rotate(' + degSeconds + 'deg); -moz-transform: rotate(' + degSeconds + 'deg); -ms-transform: rotate(' + degSeconds + 'deg); transform: rotate(' + degSeconds + 'deg);')
		clockMinutes.setAttribute('style', '-webkit-transform: rotate(' + degMinutes + 'deg); -moz-transform: rotate(' + degMinutes + 'deg); -ms-transform: rotate(' + degMinutes + 'deg); transform: rotate(' + degMinutes + 'deg);')
		clockHours.setAttribute('style', '-webkit-transform: rotate(' + degHours + 'deg); -moz-transform: rotate(' + degHours + 'deg); -ms-transform: rotate(' + degHours + 'deg); transform: rotate(' + degHours + 'deg);')
	}

	setInterval(getTime, 1000)
	getTime()
}
