import {format} from "d3"

const utils = {
  heightOf: function(elementId) {
    const el = document.getElementById(elementId)
    if (el == null) {
      return 0
    }
    return el.clientHeight
  },

  formatPercent: function(num) {
    return format(".2%")(num)
  },

  formatNum: function(num) {
    return format(",")(num)
  },

  formatMoney: function(num) {
    return format("$,.0f")(num)
  }
}

export default utils
