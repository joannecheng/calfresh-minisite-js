import mapboxgl from "mapbox-gl"
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9hbm5lY2hlbmciLCJhIjoiYV9YSTdaZyJ9.tOevZpArPItdszzQl_GLJQ'

/********************/
// Drawing Maps
/********************/
function drawCounties(quoteMap, quotes, counties) {
  // This is complicated because of Mapbox Gl's DSL
  // See https://www.mapbox.com/mapbox-gl-js/example/hover-styles/ for more
  // information on what's going on
  quoteMap.addSource("counties", {type: "geojson", data: counties})
  //quoteMap.addLayer({id: "is-gcf-fill",
  //                   type: "fill",
  //                   source: "counties",
  //                   layout: {},
  //                   paint: {"fill-color": "#3d9cd1",
  //                           "fill-opacity": ["case"
  //                                            ["boolean", ["get", "is_gcf"], false], 0.4, 0]
  //                          }
  //                  })

  quoteMap.addLayer({id: "california-county-fill",
                     type: "fill",
                     source: "counties",
                     layout: {},
                     paint: {"fill-color": "#3d9cd1",
                             "fill-opacity": ["case"
                                              ["boolean", ["feature-state", "selected"], false], 0.6, 0]
                            }
                    })
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
        quoteMap.on("load", () => {
          fetchCounties()
            .then((counties) => drawCounties(quoteMap, quotes, counties))
        })
      })

  }
}

module.exports = QuoteMap
