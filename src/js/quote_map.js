import mapboxgl from "mapbox-gl"
import QuoteView from "./quote_view"

mapboxgl.accessToken = 'pk.eyJ1Ijoiam9hbm5lY2hlbmciLCJhIjoiYV9YSTdaZyJ9.tOevZpArPItdszzQl_GLJQ'

/********************/
// Map Interactions
/********************/
let selectedCounty_gbl = 0

function selectCounty(quoteMap, e) {
  const feature = e.features[0]
  const countyName = feature.properties.name
  const countyId = feature.id

  console.log(countyName, countyId)
  // highlight county
  quoteMap.setFeatureState({source: "counties", id: selectedCounty_gbl},
                           {selected: false})
  selectedCounty_gbl = countyId
  quoteMap.setFeatureState({source: "counties", id: countyId},
                           {selected: true})

  // Scroll to "user_selected_county"
  // Update displayed quotes
}

/********************/
// Drawing Maps
/********************/
function drawCounties(quoteMap, quotes, counties) {
  // This is complicated because of Mapbox Gl's DSL
  // See https://www.mapbox.com/mapbox-gl-js/example/hover-styles/ for more
  // information on what's going on

  //Defining the map source
  quoteMap.addSource("counties", {type: "geojson", data: counties})

  // Map fill: highligh GCF Counties
  quoteMap.addLayer({id: "is-gcf-fill",
                     type: "fill",
                     source: "counties",
                     layout: {},
                     paint: {"fill-color": "#3d9cd1",
                             "fill-opacity": ["case",
                                              ["boolean", ["get", "is_gcf"], false],
                                              0.4, 0]
                            }
                    })

  // Map fill (selected county)
  quoteMap.addLayer({
    id: "county-fills",
    type: "fill",
    source: "counties",
    layout: {},
    paint: {
      "fill-color": "#e25050",
      "fill-opacity": ["case",
                       ["boolean", ["feature-state", "selected"], false],
                       0.6, 0]
    }
  })

  // Map outline
  quoteMap.addLayer({
    id: "county-borders",
    type: "line",
    source: "counties",
    layout: {},
    paint: {
      "line-color": "#555",
      "line-width": 1
    }
  })

  // click handler
  quoteMap.on("click", "county-fills", selectCounty.bind(this, quoteMap))

}

function drawMap() {
  const bounds =  new mapboxgl.LngLatBounds(
    [-124.48200988, 31.52952194],
    [-114.13077545, 43.00950241])

  return new mapboxgl.Map({container: "quote_map",
                style: "mapbox://styles/mapbox/light-v9",
                maxBounds: bounds})
}

/********************/
// Data Fetching functions
/********************/
function fetchCounties() {
  return fetch("./assets/data/california-counties.json")
    .then((response) => response.json())
}

function loadQuotes() {
  return fetch("./assets/data/quotes.json")
    .then((response) => response.json())
}

/********************/
// Public Methods
/********************/
const QuoteMap = {
  draw: function() {
    const quoteMap = drawMap()
    loadQuotes()
      //.then((response) => "TODO preload quotes here")
      .then((quotes) => {
        QuoteView.render(quotes)
        quoteMap.on("load", () => {
          fetchCounties()
            .then((counties) => drawCounties(quoteMap, quotes, counties))
        })
      })
  }
}

export default QuoteMap
