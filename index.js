import ScrollMagic from "scrollmagic";
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

function initializeMap () {
}

window.main = function() {
  initalizeSideNavHandlers()
}
