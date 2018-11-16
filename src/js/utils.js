const utils = {
  heightOf: function(elementId) {
    const el = document.getElementById(elementId)
    if (el == null) {
      return 0
    }
    return el.clientHeight
  }
}

module.exports = utils
