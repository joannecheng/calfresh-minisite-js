"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _mapboxGl = require("mapbox-gl");

var _mapboxGl2 = _interopRequireDefault(_mapboxGl);

require("./assets/data/california-counties.geojson");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

_mapboxGl2.default.accessToken = "pk.eyJ1Ijoiam9hbm5lY2hlbmciLCJhIjoiYV9YSTdaZyJ9.tOevZpArPItdszzQl_GLJQ";

var counties = ["Los Angeles", "San Diego", "Orange", "Riverside", "San Bernardino", "Santa Clara", "Alameda", "Sacramento", "Contra Costa", "Fresno", "Kern", "San Francisco", "Ventura", "San Mateo", "San Joaquin"];

function drawMap() {
  return new _mapboxGl2.default.Map({
    container: "quote_map",
    style: "mapbox://styles/mapbox/dark-v9",
    maxBounds: new _mapboxGl2.default.LngLatBounds([-124.482009887695 - 1, 32.5295219421387 - 0.85], [-114.13077545166 + 1, 42.0095024108887 + 0.85])
  });
}

var QuoteMap = function () {
  function QuoteMap() {
    _classCallCheck(this, QuoteMap);

    this.map = drawMap();

    this.drawCalifornia();
  }

  _createClass(QuoteMap, [{
    key: "drawCalifornia",
    value: function drawCalifornia() {
      var _this = this;

      fetch("./assets/data/california-counties.geojson").then(function (response) {
        return response.json();
      }).then(function (geojson) {
        _this.map.addLayer({
          id: "california_counties",
          type: "line",
          source: {
            type: "geojson",
            data: geojson
          },
          "layout": {
            "line-join": "round",
            "line-cap": "round"
          },
          "paint": {
            "line-color": "#ccc",
            "line-width": 2
          }

        });
      });
    }
  }]);

  return QuoteMap;
}();

exports.default = QuoteMap;