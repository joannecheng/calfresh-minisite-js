import * as d3 from "d3"
import utils from "./utils"
import incomeData from "./income_data"
import colData from "./col_data"

let incomeType_gbl = 2
let showAllCounties_gbl = "hide" // show | hide
let numberChildren_gbl = "one_child"
let numberAdults_gbl = "one_adult"
const INCOME_DATA_INDEX = {1: "lower-quartile", 2: "median"}
const FAMILY_TYPE_INDEX = {one_adult_no_children: 1,
                           one_adult_one_child: 2 ,
                           one_adult_two_children: 3 ,
                           one_adult_three_children: 4,
                           two_adults_one_child: 5,
                           two_adults_two_children: 6,
                           two_adults_three_children: 7}
const MARGINS = {left: 110, right: 15, top: 23}
const LINE_PADDING = 16

/*********************************************
// Data Manipulation
*********************************************/
function getFamilyTypeIndex() {
  const familyTypeString =`${numberAdults_gbl}_${numberChildren_gbl}`
  return FAMILY_TYPE_INDEX[familyTypeString];
}

function lineScale(width) {
  return d3.scaleLinear()
    .domain([0, 150000]) // this value should be generated
    .range([0, width])
}

function getIncomeCOLData(counties) {
  // Return median income, cost of living, and median income minus cost of living
  return counties.map((county) => {
    const incomeRow = incomeData.find((row) => row[0] === county)
    const colRow = colData.find((row) => row[0] === county)
    const familyType = getFamilyTypeIndex()

    return {
      county: county,
      income: incomeRow[incomeType_gbl],
      col: colRow[familyType],
      diff: incomeRow[incomeType_gbl] - colRow[familyType]
    }
  })
}

function countiesToShow(incomeCOLData) {
  const sortedData = incomeCOLData.sort((rowA, rowB) => {
    return rowA.diff - rowB.diff
  })

  if (showAllCounties_gbl == "show") {
    return sortedData
  }

  const COLgreaterThanIncome = sortedData.filter((row) => { return row.diff < 1000})

  // This is really hacky, but it prevents the chart from showing no data
  if (COLgreaterThanIncome.length < 3) {
    return sortedData
  }
  return COLgreaterThanIncome
}

/*********************************************
// SVG Drawing functions
*********************************************/
function createSVG(elementId, width, height) {
  return d3.select(`#${elementId}`)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
}

function drawGrid(svg, width, incomeCOLData) {
  svg
    .selectAll("rect.row")
    .data(incomeCOLData).enter()
    .append("rect")
    .attr("class", (_, i) => {
      if (i % 2 === 0)
        return "even"
      return "odd"
    })
    .classed("row", true)
    .attr("transform", utils.translateStr(0, -(LINE_PADDING / 2)))
    .attr("x", 0)
    .attr("y", (_, i) => i * LINE_PADDING)
    .attr("width", width)
    .attr("height", LINE_PADDING)
    //.on("mouseover", () => console.debug("TODO: TOOLTIPS"))
    //.on("mouseout", () => console.debug("TODO: TOOLTIPS"))
}

function drawGridLines(svg, width, height, scale) {
  const gridVals = [20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000]
  const gridContainer = svg.append("g")
        .classed("grid-lines", true)
        .attr("transform", utils.translateStr(MARGINS.left, -7))

  gridContainer.selectAll("line.grid-line")
    .data(gridVals).enter()
    .append("line")
    .classed("grid-line", true)
    .attr("x1", scale)
    .attr("x2", scale)
    .attr("y1", 0)
    .attr("y2", height - MARGINS.top)
    .attr("stroke", "#aaa")
    .attr("stroke-width", 0.5)
}

function drawLines(svg, incomeCOLData, scale) {
  svg.selectAll("line.col-line")
    .data(incomeCOLData).enter()
    .append("line")
    .attr("class", (d) => { if (d.diff < 1000) return "below"})
    .classed("col-line", true)
    .attr("x1", (d) => scale(d.col))
    .attr("x2", (d) => scale(d.income))
    .attr("y1", (_, i) => LINE_PADDING * i)
    .attr("y2", (_, i) => LINE_PADDING * i)
}

function drawMarker(svg, incomeCOLData, scale, markerClass) {
  const markerHeight = 3

  svg.selectAll(`circle.${markerClass}`)
    .data(incomeCOLData).enter()
    .append("line")
    .classed(markerClass, true)
    .classed("marker", true)
    .attr("x1", (d) => {
      if (markerClass == "income-marker")
        return scale(d.income)
      return scale(d.col)
    })
    .attr("x2", (d) => {
      if (markerClass == "income-marker")
        return scale(d.income)
      return scale(d.col)
    })
    .attr("y1", (_, i) => LINE_PADDING * i - markerHeight)
    .attr("y2", (_, i) => LINE_PADDING * i + markerHeight)
}

function drawLabels(svg, incomeCOLData) {
  const textSvg = svg.append("g")
        .attr("font-color", "grey")

  textSvg.append("text")
    .text("Cost of Living/Income Diff")
    .attr("x", 10)
    .attr("y", -13)
    .attr("font-weight", "bold")
    .attr("font-size", "0.75rem")

  textSvg.append("text")
    .text("County")
    .attr("x", 0)
    .attr("y", -13)
    .attr("text-anchor", "end")
    .attr("font-weight", "bold")
    .attr("font-size", "0.75rem")

  textSvg.selectAll("text.county-label")
    .data(incomeCOLData).enter()
    .append("text")
    .classed("county-label", true)
    .text((d) => d.county)
    .attr("x", 0)
    .attr("y", (_, i) => 1.5 + (i * LINE_PADDING))

  textSvg.selectAll("text.number-label")
    .data(incomeCOLData).enter()
    .append("text")
    .classed("number-label", true)
    .text((d) => {return utils.formatMoney(d.diff)})
    .attr("x", 10)
    .attr("y", (_, i) => 1.5 + (i * LINE_PADDING))
}

/*********************************************
// Event Handlers
*********************************************/

function setClickHandlerFor(elementId, handler) {
  d3.selectAll(`#${elementId} a`)
    .on("click", handler)
}

function clearControls(el) {
  el.selectAll("a").classed("active", false)
}

function setActiveControlFor(d3Selection, property) {
  d3Selection.select(`[data-name="${property}"]`)
    .classed("active", true)
}

function setActiveControls() {
  const showCounties = d3.select("#show_counties_controls")
  const incomeControls = d3.select("#income_controls")
  const numAdults = d3.select("#num_adults_controls")
  const numChildren = d3.select("#num_children_controls")

  clearControls(showCounties)
  clearControls(incomeControls)
  clearControls(numAdults)
  clearControls(numChildren)
  const incomeOption = INCOME_DATA_INDEX[incomeType_gbl]

  setActiveControlFor(showCounties, showAllCounties_gbl)
  setActiveControlFor(incomeControls, incomeOption)
  setActiveControlFor(numAdults, numberAdults_gbl)
  setActiveControlFor(numChildren, numberChildren_gbl)
}

/*********************************************
// Public functions
*********************************************/
const COLVsIncome = {
  setClickHandlers: function() {
    setClickHandlerFor("show_counties_controls", function() {
      if (showAllCounties_gbl === "show") {
        showAllCounties_gbl = "hide"
      } else {
        showAllCounties_gbl = "show"
      }
      COLVsIncome.clear()
      COLVsIncome.draw()
    })

    setClickHandlerFor("income_controls", function() {
      if (incomeType_gbl === 1) {
        incomeType_gbl = 2
      } else {
        incomeType_gbl = 1
      }
      COLVsIncome.clear()
      COLVsIncome.draw()
    })

    setClickHandlerFor("num_adults_controls", function() {
      numberAdults_gbl = this.getAttribute("data-name")
      COLVsIncome.clear()
      COLVsIncome.draw()
    })
    setClickHandlerFor("num_children_controls", function() {
      numberChildren_gbl = this.getAttribute("data-name")
      COLVsIncome.clear()
      COLVsIncome.draw()
    })
  },

  clear: function() {
    d3.selectAll("#col_vs_income svg").remove()
  },

  draw: function(incomeData) {
    setActiveControls()
    const counties = colData.map((row) => row[0])
    const incomeCOLData = countiesToShow(getIncomeCOLData(counties))

    const elementId = "col_vs_income"
    const width = utils.widthOf(elementId)
    const height = MARGINS.top + (LINE_PADDING * incomeCOLData.length)
    const scale = lineScale(width)

    const svg = createSVG(elementId, width, height)
    const gridSvg = svg.append("g")
          .classed("grid", true)
          .attr("transform", utils.translateStr(0, MARGINS.top))
    const linesSvg = svg.append("g")
          .classed("col-lines", true)
          .attr("transform", utils.translateStr(MARGINS.left, MARGINS.top))

    // DRAWING
    drawGrid(gridSvg, width, counties)
    drawGridLines(gridSvg, width, height, scale)
    drawLines(linesSvg, incomeCOLData, scale)
    drawMarker(linesSvg, incomeCOLData, scale, "income-marker")
    drawMarker(linesSvg, incomeCOLData, scale, "col-marker")
    drawLabels(linesSvg, incomeCOLData)
  }
}

export default COLVsIncome
