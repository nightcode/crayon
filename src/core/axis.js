crayon.axis = function() {
  var scale = d3.scale.linear(),
      orient = "horizontal",
      textAnchor = "end",
      tickMajorSize = 6,
      tickMajorTailSize = 0,
      tickPadding = 3,
      axisPosition = 0,
      tickPosition = 0,
      tickArguments_ = [10],
      tickValues = null,
      tickFormat_;

  function axis(g) {
    g.each(function() {
      var g = d3.select(this);

      var ticks = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments_) : scale.domain()) : tickValues,
          tickFormat = tickFormat_ == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments_) : String) : tickFormat_;

      var tick = g.selectAll("g").data(ticks, String),
          tickEnter = tick.enter().insert("g", "path").style("opacity", 1e-6),
          tickExit = d3.transition(tick.exit()).style("opacity", 1e-6).remove(),
          tickUpdate = d3.transition(tick).style("opacity", 1),
          tickTransform;

      var range = crayon_scaleRange(scale),
          path = g.selectAll(".domain").data([0]),
          pathEnter = path.enter().append("path").attr("class", "domain"),
          pathUpdate = d3.transition(path);
    
      var scale1 = scale.copy(),
          scale0 = this.__chart__ || scale1;
      this.__chart__ = scale1;

      tickEnter.append("line").attr("class", "tick");
      tickEnter.append("text");
      tickUpdate.select("text").text(tickFormat);

      tickEnter.selectAll("line").filter(function(d) { return !d; }).classed("zero", true);
      tickEnter.selectAll("text").filter(function(d) { return !d; }).classed("zero", true);
      
      switch (orient) {
        case "horizontal": {
          tickTransform = crayon_svg_axisX;
          tickEnter.select("line").attr("y1", tickMajorTailSize);
          tickUpdate.select("line").attr("x2", 0).attr("y2", tickMajorSize);
          tickUpdate.select("text").attr("x", 0).attr("y", 10 + tickMajorTailSize).attr("dy", ".71em").attr("text-anchor", "middle");
          pathUpdate.attr("d", "M" + range[0] + ",0V0H" + range[1] + "V0");
          break;
        }                    
        case "vertical": {
          tickTransform = crayon_svg_axisY;
          tickUpdate.select("line").attr("x1", -tickPosition).attr("x2", (-tickPosition + tickMajorSize)).attr("y2", 0);
          pathUpdate.attr("d", "M" + axisPosition + ",0H" + axisPosition + "V" + range[1] + "H" + axisPosition);
          switch (textAnchor) {
            case "start": {
              tickUpdate.select("text").attr("x", tickPadding).attr("y", 0).attr("dy", "-.32em").attr("text-anchor", "start");
              break;
            }
            case "end": {
              tickUpdate.select("text").attr("x", -tickPadding).attr("y", 0).attr("dy", "-.32em").attr("text-anchor", "end");
              break;
            }
          }          
          break;
        }
      }

      if (scale.ticks) {
        tickEnter.call(tickTransform, scale0);
        tickUpdate.call(tickTransform, scale1);
        tickExit.call(tickTransform, scale1);
      } else {
        var dx = scale1.rangeBand() / 2, x = function(d) { return scale1(d) + dx; };
        tickEnter.call(tickTransform, x);
        tickUpdate.call(tickTransform, x);
      }
    });
  }

  function crayon_svg_axisX(selection, x) {
    selection.attr("transform", function(d) { return "translate(" + x(d) + "," + tickPosition + ")"; });
  }
  
  function crayon_svg_axisY(selection, y) {
    selection.attr("transform", function(d) { return "translate(" + tickPosition + "," + y(d) + ")"; });
  } 
  
  axis.scale = function(x) {
    if (!arguments.length) return scale;
    scale = x;
    return axis;
  };

  axis.orient = function(x) {
    if (!arguments.length) return orient;
    orient = x;
    return axis;
  };

  axis.textAnchor = function(x) {
    if (!arguments.length) return textAnchor;
    textAnchor = x;
    return axis;
  };
  
  axis.ticks = function() {
    if (!arguments.length) return tickArguments_;
    tickArguments_ = arguments;
    return axis;
  };

  axis.tickValues = function(x) {
    if (!arguments.length) return tickValues;
    tickValues = x;
    return axis;
  };

  axis.tickFormat = function(x) {
    if (!arguments.length) return tickFormat_;
    tickFormat_ = x;
    return axis;
  };

  axis.tickSize = function(x, y) {
    if (!arguments.length) return tickMajorSize;
    var n = arguments.length - 1;
    tickMajorSize = x;
    tickMajorTailSize = n > 0 ? +y : tickMajorSize;
    return axis; 
  };

  axis.tickPadding = function(x) {
    if (!arguments.length) return tickPadding;
    tickPadding = +x;
    return axis;
  };

  axis.axisPosition = function(x) {
    if (!arguments.length) return axisPosition;
    axisPosition = x;
    return axis;
  };
  
  axis.tickPosition = function(x) {
    if (!arguments.length) return tickPosition;
    tickPosition = x;
    return axis;
  };
  
  return axis;
};

function crayon_scaleExtent(domain) {
  var start = domain[0], stop = domain[domain.length - 1];
  return start < stop ? [start, stop] : [stop, start];
}

function crayon_scaleRange(scale) {
  return scale.rangeExtent ? scale.rangeExtent() : crayon_scaleExtent(scale.range());
}
