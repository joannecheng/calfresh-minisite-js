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
}(); // *********** cost of living spike *************


var _d = require("d3");

var d3 = _interopRequireWildcard(_d);

var _d3SvgAnnotation = require("d3-svg-annotation");

var _d3SvgAnnotation2 = _interopRequireDefault(_d3SvgAnnotation);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }newObj.default = obj;return newObj;
  }
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var topMargin = 15;
var barPosition = 55;

var COLGraph = function () {
  function COLGraph(height, width, selector) {
    _classCallCheck(this, COLGraph);

    this.height = height;
    this.width = width;
    this.selector = selector;

    this.barScale = d3.scaleLinear().domain([0, 70000]).range([0, width - 140]);
  }

  _createClass(COLGraph, [{
    key: "createSVG",
    value: function createSVG() {
      this.svg = d3.select(this.selector).append("svg").attr("width", this.width).attr("height", this.height);

      this.barScale = d3.scaleLinear().domain([0, 70000]).range([0, this.width - 140]);
    }
  }, {
    key: "removeAll",
    value: function removeAll() {
      this.svg.remove();
    }
  }, {
    key: "drawMedianIncome",
    value: function drawMedianIncome() {
      var annotations = [{
        note: {
          label: "CA Median Income ($63,783, $47,443 take-home)",
          bgPadding: { "top": 8, "left": 5, "right": 5, "bottom": 5 }
        },
        //can use x, y directly instead of data
        className: "show-bg",
        dy: 40,
        dx: -40,
        y: 160
      }];
      this.drawLimit(47443, annotations);
    }
  }, {
    key: "draw50K",
    value: function draw50K() {
      var annotations = [{
        note: {
          label: "40% of Californians make less than 50K a year**",
          bgPadding: { "top": 15, "left": 10, "right": 10, "bottom": 10 }
        },
        //can use x, y directly instead of data
        className: "show-bg",
        dy: 40,
        dx: -40,
        x: lineLimit,
        y: 160
      }];

      drawLimit(39007, annotations);
    }
  }, {
    key: "drawLimit",
    value: function drawLimit(income, annotations) {
      var lineLimit = this.barScale(income); // 50K, 39077 takehome
      var lineHeight = this.height - topMargin;

      annotations[0].x = lineLimit;

      this.svg.append("line").attr("x1", lineLimit).attr("x2", lineLimit).attr("y1", 0).attr("y2", lineHeight).classed("limit-line", true).attr("transform", "translate(" + barPosition + ", " + topMargin + ")");

      var makeAnnotations = _d3SvgAnnotation2.default.annotation().editMode(false).notePadding(5).type(_d3SvgAnnotation2.default.annotationCallout).annotations(annotations);

      this.svg.append("g").attr("transform", "translate(" + barPosition + ", " + topMargin + ")").call(makeAnnotations);
    }
  }, {
    key: "drawSegment",
    value: function drawSegment(barSvg, barHeight, datum) {
      var t = this;
      return function (key) {
        var keyClass = key.toLowerCase().replace(" ", "-");
        return barSvg.append("rect").attr("x", 0).attr("y", 0).attr("width", t.barScale(datum[key])).attr("height", barHeight).classed(keyClass, true);
      };
    }
  }, {
    key: "drawStack",
    value: function drawStack(datum, offset, label) {
      var gClass = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";

      var barHeight = 15;
      var topOffset = offset + topMargin;

      var stackedBar = this.svg.append("g").attr("class", "stacked-bar").attr("transform", "translate(0," + topOffset + ")");

      var segmentsSvg = stackedBar.append("g").classed("segments", true).attr("transform", "translate(" + barPosition + ")");

      var segmentGenerator = this.drawSegment(segmentsSvg, barHeight, datum);

      segmentGenerator("Housing");
      segmentGenerator("Medical").attr("transform", "translate(" + this.barScale(datum["Housing"]) + ")");

      var pos = datum["Housing"] + datum["Medical"];
      segmentGenerator("Transportation").attr("transform", "translate(" + this.barScale(pos) + ")");

      pos = pos + datum["Transportation"];
      segmentGenerator("Child Care").attr("transform", "translate(" + this.barScale(pos) + ")");

      pos = pos + datum["Child Care"];
      segmentGenerator("Food").attr("transform", "translate(" + this.barScale(pos) + ")");

      stackedBar.append("foreignObject").attr("width", barPosition - 5).attr("height", barHeight).attr("x", 0).attr("y", 2).attr("class", "label").append("xhtml:div").attr("xmlns", "http://www.w3.org/1999/xhtml").text(label);
    }
  }, {
    key: "drawLegend",
    value: function drawLegend() {
      var labels = ["Housing", "Medical", "Transportation", "Child Care", "Food"];
      var boxSize = 15;

      // rects
      var legendContainer = this.svg.append("g").classed("legend", true).attr("transform", "translate(" + (this.width - 20) + ", " + topMargin + ")");

      legendContainer.selectAll(".legend rect").data(labels).enter().append("rect").attr("width", boxSize).attr("height", boxSize).attr("x", 0).attr("y", function (d, i) {
        return i * 25;
      }).attr("class", function (d) {
        return d.toLowerCase().replace(" ", "-");
      });

      legendContainer.selectAll(".legend text").data(labels).enter().append("text").attr("x", -5).attr("y", function (d, i) {
        return boxSize * 0.75 + i * 25;
      }).text(function (d) {
        return d;
      });
    }
  }]);

  return COLGraph;
}();

exports.default = COLGraph;