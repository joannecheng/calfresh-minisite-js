import ScrollMagic from "scrollmagic"
import QuoteMap from "./quote_map"
import COLVsIncome from "./col_vs_income"
import utils from "./utils"

function initalizeSideNavHandlers () {
  const controller = new ScrollMagic.Controller()
  const elements = ["making_ends_meet", "better_jobs", "disability_illness", "calfresh_results", "cta"]

  elements.forEach(function(element) {
    new ScrollMagic.Scene({
      triggerElement: `#${element}`,
      duration: utils.heightOf(element)
    }).setClassToggle(`#${element}_nav`, "active")
      .addTo(controller)
  })
}

function updateWidthListener() {
  window.addEventListener("resize", () => {
    COLVsIncome.clear()
    COLVsIncome.draw()
  })
}
window.main = function() {
  initalizeSideNavHandlers()
  QuoteMap.draw()
  COLVsIncome.draw()
  COLVsIncome.setClickHandlers()

  updateWidthListener()
}
