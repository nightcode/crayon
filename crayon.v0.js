(function() {
  function crayon_colors(domain) {
    function color(index) {
      var filtered = filter ? domain.filter(filter) : domain;
      return filtered[index % filtered.length];
    }
    var filter;
    color.domain = function(c) {
      if (!arguments.length) return domain;
      domain = c.map(Number);
      return color;
    };
    color.filter = function(f) {
      if (!arguments.length) return filter;
      filter = f;
      return color;
    };
    return color;
  }
  function crayon_scaleExtent(domain) {
    var start = domain[0], stop = domain[domain.length - 1];
    return start < stop ? [ start, stop ] : [ stop, start ];
  }
  function crayon_scaleRange(scale) {
    return scale.rangeExtent ? scale.rangeExtent() : crayon_scaleExtent(scale.range());
  }
  crayon = {
    version: "0.1"
  };
  crayon.colors = function() {
    return crayon_colors([ "#4fa55e", "#c45c5b", "#e7a847", "#4b99eb", "#a05eb5", "#8983ef" ]);
  };
  crayon.legend = function() {
    function legend_(selection) {
      selection.each(function(seriesNames) {
        var g = d3.select(this);
        g.append("rect").style("stroke-width", "1").attr("class", "legend-container").attr("x", "1").attr("y", "0").attr("width", width - 2).attr("height", height - 2);
        var legend = g.selectAll(".legend").data(seriesNames), legendEnter = legend.enter().append("g").attr("class", "legend-box").on("click", function(d, i) {
          var rect = d3.select(this).selectAll(".legend-rect");
          rect.attr("class", d.disabled ? "legend-rect" : "legend-rect disabled");
          dispatch.onLegendClick(d, i);
        }), legendExit = legend.exit().remove(), legendUpdate = legend;
        legendEnter.append("rect").attr("class", "legend-rect").attr("ry", "3").attr("x", "0").attr("y", "0").attr("height", "20");
        var legendTitle = legendEnter.append("g");
        legendTitle.append("path").style("stroke", function(d, i) {
          return colors(i);
        }).attr("class", "legend-line").attr("d", "m " + margin.left + ",10 " + markerLength + ",0");
        legendTitle.append("text").text(function(d) {
          return d.key;
        }).attr("class", "legend-text").attr("text-anchor", "start").attr("dy", "13").attr("dx", textMargin);
        var titlesWidths = [];
        legendTitle.selectAll(".legend-text").each(function(d) {
          titlesWidths.push(d3.select(this).node().getComputedTextLength());
        });
        legendUpdate.each(function(d, i) {
          d3.select(this).select(".legend-rect").attr("width", titlesWidths[i] + textMargin + margin.right);
        });
        var distance = 10;
        legendUpdate.attr("transform", function(d, i) {
          var position = distance;
          distance += titlesWidths[i] + textMargin + margin.right + boxDistance;
          return "translate(" + position + ",4)";
        });
      });
    }
    var dispatch = d3.dispatch("onLegendClick");
    var colors = crayon.colors(), width = 400, height = 30, margin = {
      top: 0,
      right: 5,
      bottom: 0,
      left: 5
    }, markerLength = 7, boxDistance = 8, textMargin = margin.left + margin.left + markerLength;
    legend_.dispatch = dispatch;
    legend_.colors = function(_) {
      if (!arguments.length) return colors;
      colors = _;
      return legend_;
    };
    legend_.width = function(_) {
      if (!arguments.length) return width;
      width = _;
      return legend_;
    };
    legend_.height = function(_) {
      if (!arguments.length) return height;
      height = _;
      return legend_;
    };
    return legend_;
  };
  crayon.axis = function() {
    function axis(g) {
      g.each(function() {
        var g = d3.select(this);
        var ticks = tickValues == null ? scale.ticks ? scale.ticks.apply(scale, tickArguments_) : scale.domain() : tickValues, tickFormat = tickFormat_ == null ? scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments_) : String : tickFormat_;
        var tick = g.selectAll("g").data(ticks, String), tickEnter = tick.enter().insert("g", "path").style("opacity", 1e-6), tickExit = d3.transition(tick.exit()).style("opacity", 1e-6).remove(), tickUpdate = d3.transition(tick).style("opacity", 1), tickTransform;
        var range = crayon_scaleRange(scale), path = g.selectAll(".domain").data([ 0 ]), pathEnter = path.enter().append("path").attr("class", "domain"), pathUpdate = d3.transition(path);
        var scale1 = scale.copy(), scale0 = this.__chart__ || scale1;
        this.__chart__ = scale1;
        tickEnter.append("line").attr("class", "tick");
        tickEnter.append("text");
        tickUpdate.select("text").text(tickFormat);
        tickEnter.selectAll("line").filter(function(d) {
          return !d;
        }).classed("zero", true);
        tickEnter.selectAll("text").filter(function(d) {
          return !d;
        }).classed("zero", true);
        switch (orient) {
         case "horizontal":
          {
            tickTransform = crayon_svg_axisX;
            tickEnter.select("line").attr("y1", tickMajorTailSize);
            tickUpdate.select("line").attr("x2", 0).attr("y2", tickMajorSize);
            tickUpdate.select("text").attr("x", 0).attr("y", 10 + tickMajorTailSize).attr("dy", ".71em").attr("text-anchor", "middle");
            pathUpdate.attr("d", "M" + range[0] + ",0V0H" + range[1] + "V0");
            break;
          }
         case "vertical":
          {
            tickTransform = crayon_svg_axisY;
            tickUpdate.select("line").attr("x1", -tickPosition).attr("x2", -tickPosition + tickMajorSize).attr("y2", 0);
            pathUpdate.attr("d", "M" + axisPosition + ",0H" + axisPosition + "V" + range[1] + "H" + axisPosition);
            switch (textAnchor) {
             case "start":
              {
                tickUpdate.select("text").attr("x", tickPadding).attr("y", 0).attr("dy", "-.32em").attr("text-anchor", "start");
                break;
              }
             case "end":
              {
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
          var dx = scale1.rangeBand() / 2, x = function(d) {
            return scale1(d) + dx;
          };
          tickEnter.call(tickTransform, x);
          tickUpdate.call(tickTransform, x);
        }
      });
    }
    function crayon_svg_axisX(selection, x) {
      selection.attr("transform", function(d) {
        return "translate(" + x(d) + "," + tickPosition + ")";
      });
    }
    function crayon_svg_axisY(selection, y) {
      selection.attr("transform", function(d) {
        return "translate(" + tickPosition + "," + y(d) + ")";
      });
    }
    var scale = d3.scale.linear(), orient = "horizontal", textAnchor = "end", tickMajorSize = 6, tickMajorTailSize = 0, tickPadding = 3, axisPosition = 0, tickPosition = 0, tickArguments_ = [ 10 ], tickValues = null, tickFormat_;
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
  crayon.bar = function() {
    function bar(data, layer) {
      var path = [], i = -1, n = data.length, d;
      while (++i < n) {
        d = data[i];
        path.push("M", x(d, i, layer), ",", y(d, i, layer), "V", height(d, i, layer), "h", width(d, i, layer), "V", y(d, i, layer));
      }
      return path.join("");
    }
    var x = function(d, i, layer) {
      return d.x;
    }, y = function(d, i, layer) {
      return 0;
    }, height = function(d, i, layer) {
      return d.y;
    }, width = function(d, i, layer) {
      return 7;
    };
    bar.x = function(_) {
      if (!arguments.length) {
        return x;
      }
      x = _;
      return bar;
    };
    bar.y = function(_) {
      if (!arguments.length) {
        return y;
      }
      y = _;
      return bar;
    };
    bar.height = function(_) {
      if (!arguments.length) {
        return height;
      }
      height = _;
      return bar;
    };
    bar.width = function(_) {
      if (!arguments.length) {
        return width;
      }
      width = _;
      return bar;
    };
    return bar;
  };
  crayon_chart = function() {
    function chart_(selection) {
      selection.each(function() {
        var that = this;
        var container = d3.select(that), g = container.select("g"), gChart = g.select(".chart");
        legendPaint.colors(colors).width(width);
        var legendHeight = legendVisible ? legendPaint.height() : 1;
        chartPaint.colors(colors).width(width - margin.left - margin.right).height(height - margin.top - margin.bottom - legendHeight);
        if (g.empty()) {
          g = container.append("svg").attr("width", width).attr("height", height).append("g");
          g.append("g").attr("class", "chart").attr("transform", "translate(0,0)");
          g.select(".chart").append("rect").style("stroke-width", "1").attr("class", "chart-container").attr("x", "1").attr("y", "1").attr("width", width - 2).attr("height", height - legendHeight - 1);
          gChart = g.select(".chart");
          gChart.append("g").attr("class", "chart-box").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
          if (legendVisible) {
            var gLegend = g.append("g").attr("class", "legendPaint").attr("transform", "translate(0, " + (height - legendHeight) + ")");
            gLegend.datum(chartPaint.seriesNames()).call(legendPaint);
            legendPaint.dispatch.on("onLegendClick", function(d) {
              d.disabled = !d.disabled;
              selection.transition().call(chart_);
            });
          }
        }
        gChart.select("g").call(chartPaint);
      });
    }
    var margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 20
    }, width = 400, height = 200, colors = crayon.colors(), legendPaint = crayon.legend(), legendVisible = true, x = function(d, i) {
      return d[i];
    }, y = function(d, i) {
      return d[i];
    }, chartPaint, data;
    chart_.margin = function(_) {
      if (!arguments.length) {
        return margin;
      }
      margin = _;
      return chart_;
    };
    chart_.width = function(_) {
      if (!arguments.length) {
        return width;
      }
      width = _;
      return chart_;
    };
    chart_.height = function(_) {
      if (!arguments.length) {
        return height;
      }
      height = _;
      return chart_;
    };
    chart_.x = function(_) {
      if (!arguments.length) {
        return x;
      }
      x = _;
      return chart_;
    };
    chart_.y = function(_) {
      if (!arguments.length) {
        return y;
      }
      y = _;
      return chart_;
    };
    chart_.xScale = function(_) {
      if (!arguments.length) {
        return chartPaint.xScale();
      }
      chartPaint.xScale(_);
      return chart_;
    };
    chart_.yScale = function(_) {
      if (!arguments.length) {
        return chartPaint.yScale();
      }
      chartPaint.yScale(_);
      return chart_;
    };
    chart_.xTickFormat = function(_) {
      if (!arguments.length) {
        return chartPaint.xTickFormat();
      }
      chartPaint.xTickFormat(_);
      return chart_;
    };
    chart_.colors = function(_) {
      if (!arguments.length) {
        return colors.domain();
      }
      colors.domain(_);
      return chart_;
    };
    chart_.legendVisible = function(_) {
      if (!arguments.length) {
        return legendVisible;
      }
      legendVisible = _;
      return chart_;
    };
    chart_.data = function(_) {
      if (!arguments.length) {
        return data;
      }
      data = _;
      var keys = d3.keys(data[0]);
      var seriesNames = keys.filter(function(d, i) {
        return i !== 0;
      }).map(function(p) {
        return {
          key: p,
          disabled: false
        };
      }).sort();
      var series = seriesNames.map(function(series) {
        return data.map(function(d) {
          return {
            x: x.call(data, d, keys[0]),
            y: y.call(data, d, series.key)
          };
        });
      });
      chartPaint.seriesNames(seriesNames);
      chartPaint.series(series);
      return chart_;
    };
    chart_.chart = function(_) {
      if (!arguments.length) {
        return chartPaint;
      }
      chartPaint = _;
      return chart_;
    };
    return chart_;
  };
  crayon.barChart = function() {
    return crayon_chart().chart(crayon_barChart());
  };
  crayon_barChart = function() {
    function chart(selection) {
      selection.each(function() {
        var container = d3.select(this), g = container.select("g");
        if (g.empty()) {
          g = container.append("g");
          g.append("g").attr("class", "x bar-axis").attr("transform", "translate(0," + height + ")").append("path").attr("d", "M0,0V0H" + width + "V0");
          g.append("g").attr("class", "y bar-axis").attr("transform", "translate(0,0)");
          g.append("g").attr("class", "bars-chart");
          colors.filter(function(d, i) {
            return seriesNames.length > i && !seriesNames[i].disabled;
          });
          var count = series[0].length;
          var actualWidth = width / count < 70 ? width : 70 * count;
          yScale.range([ height, 10 ]);
          yAxis.ticks(d3.max([ 2, height / 50 ])).tickSize(width).tickPosition(width);
          yScale.domain([ 0, d3.max(d3.merge(series), function(d) {
            return d.y;
          }) ]).nice();
          g.select(".y.bar-axis").call(yAxis);
          var tickWidth = [];
          g.select(".y.bar-axis").selectAll("text").each(function(d) {
            tickWidth.push(d3.select(this).node().getComputedTextLength());
          });
          var tickMargin = d3.max(tickWidth);
          xScale.rangeRoundBands([ 0, actualWidth - tickMargin ], .3).domain(d3.merge(series).map(function(d) {
            return d.x;
          }));
          xAxis.tickFormat(xTickFormat);
        }
        var filteredSeries = series.filter(function(d, i) {
          return !seriesNames[i].disabled;
        });
        var mergedFilteredSeries = d3.merge(filteredSeries);
        xScale.domain(mergedFilteredSeries.map(function(d) {
          return d.x;
        }));
        yScale.domain([ 0, d3.max(mergedFilteredSeries, function(d) {
          return d.y;
        }) ]).nice();
        var xWidthScale = d3.scale.ordinal().domain(seriesNames.map(function(d) {
          return d.key;
        }).filter(function(d, i) {
          return !seriesNames[i].disabled;
        })).rangeRoundBands([ 0, xScale.rangeBand() ]);
        g.select(".x.bar-axis").call(xAxis);
        g.select(".y.bar-axis").call(yAxis);
        var layers = g.select(".bars-chart").selectAll(".bar-chart").data(filteredSeries.length > 0 ? d3.layout.stack()(filteredSeries) : []);
        layers.enter().append("g").attr("class", "bar-chart");
        layers.style("fill", function(d, i) {
          return colors(i);
        }).attr("transform", function(d, i) {
          return "translate(" + i * xWidthScale.rangeBand() + ",0)";
        });
        layers.exit().remove();
        var bars = layers.selectAll(".bar-chart rect").data(function(d) {
          return d;
        });
        bars.enter().append("rect");
        bars.attr("x", function(d) {
          return xScale(d.x);
        }).attr("y", function(d) {
          return yScale(d.y);
        }).attr("width", xWidthScale.rangeBand()).attr("height", function(d) {
          return height - yScale(d.y);
        });
        bars.exit().remove();
      });
    }
    var width = 400, height = 200, xScale = d3.scale.ordinal(), yScale = d3.scale.linear(), xAxis = crayon.axis().scale(xScale).orient("horizontal"), yAxis = crayon.axis().scale(yScale).orient("vertical"), series, seriesNames, colors, xTickFormat = function(d) {
      return d;
    };
    chart.width = function(_) {
      if (!arguments.length) return width;
      width = _;
      return chart;
    };
    chart.height = function(_) {
      if (!arguments.length) return height;
      height = _;
      return chart;
    };
    chart.xScale = function(_) {
      if (!arguments.length) {
        return xScale;
      }
      xScale = _;
      return chart;
    };
    chart.yScale = function(_) {
      if (!arguments.length) {
        return yScale;
      }
      yScale = _;
      yAxis.scale(yScale);
      return chart;
    };
    chart.xTickFormat = function(_) {
      if (!arguments.length) {
        return xTickFormat;
      }
      xTickFormat = _;
      return chart;
    };
    chart.series = function(_) {
      if (!arguments.length) return series;
      series = _;
      return chart;
    };
    chart.seriesNames = function(_) {
      if (!arguments.length) return seriesNames;
      seriesNames = _;
      return chart;
    };
    chart.colors = function(_) {
      if (!arguments.length) return colors;
      colors = _;
      return chart;
    };
    return chart;
  };
  crayon.lineChart = function() {
    return crayon_chart().chart(crayon_lineChart());
  };
  crayon_lineChart = function() {
    function chart(selection) {
      selection.each(function() {
        var container = d3.select(this), g = container.select("g");
        if (g.empty()) {
          g = container.append("g");
          g.append("g").attr("class", "x line-axis").attr("transform", "translate(0," + height + ")");
          g.append("g").attr("class", "y line-axis").attr("transform", "translate(0,0)");
          g.append("g").attr("class", "lines-chart");
          colors.filter(function(d, i) {
            return seriesNames.length > i && !seriesNames[i].disabled;
          });
          yScale.range([ height, 10 ]);
          yAxis.ticks(d3.max([ 2, height / 50 ]));
          yScale.domain([ 0, d3.max(d3.merge(series), function(d) {
            return d.y;
          }) ]).nice();
          g.select(".y.line-axis").call(yAxis);
          var tickWidth = [];
          g.select(".y.line-axis").selectAll("text").each(function(d) {
            tickWidth.push(d3.select(this).node().getComputedTextLength());
          });
          var tickMargin = d3.max(tickWidth);
          g.attr("transform", "translate(" + tickMargin + ",0)");
          xScale.range([ 0, width - tickMargin ]);
          xAxis.tickSize(tickSize, 0);
          yAxis.tickSize(width - tickMargin);
        }
        var filteredSeries = series.filter(function(d, i) {
          return !seriesNames[i].disabled;
        });
        var mergedFilteredSeries = d3.merge(filteredSeries);
        xScale.domain(d3.extent(mergedFilteredSeries, function(d) {
          return d.x;
        }));
        yScale.domain([ 0, d3.max(mergedFilteredSeries, function(d) {
          return d.y;
        }) ]).nice();
        g.select(".x.line-axis").call(xAxis);
        g.select(".y.line-axis").call(yAxis);
        var line = g.select(".lines-chart").selectAll(".line-chart").data(filteredSeries), lineEnter = line.enter().append("path").attr("class", "line-chart"), lineExit = line.exit().remove(), lineUpdate = line.style("stroke", function(p, i) {
          return colors(i);
        }).attr("d", linePaint);
      });
    }
    var width = 400, height = 200, xScale = d3.scale.linear(), yScale = d3.scale.linear(), xAxis = crayon.axis().scale(xScale).orient("horizontal"), yAxis = crayon.axis().scale(yScale).orient("vertical"), linePaint = d3.svg.line().x(function(d) {
      return xScale(d.x);
    }).y(function(d) {
      return yScale(d.y);
    }), series, seriesNames, colors, tickSize = function(d, i) {
      return i != 0 ? -height : 0;
    };
    chart.width = function(_) {
      if (!arguments.length) {
        return width;
      }
      width = _;
      return chart;
    };
    chart.height = function(_) {
      if (!arguments.length) {
        return height;
      }
      height = _;
      return chart;
    };
    chart.xScale = function(_) {
      if (!arguments.length) {
        return xScale;
      }
      xScale = _;
      xAxis.scale(xScale);
      return chart;
    };
    chart.yScale = function(_) {
      if (!arguments.length) {
        return yScale;
      }
      yScale = _;
      yAxis.scale(yScale);
      return chart;
    };
    chart.series = function(_) {
      if (!arguments.length) {
        return series;
      }
      series = _;
      return chart;
    };
    chart.seriesNames = function(_) {
      if (!arguments.length) {
        return seriesNames;
      }
      seriesNames = _;
      return chart;
    };
    chart.colors = function(_) {
      if (!arguments.length) {
        return colors;
      }
      colors = _;
      return chart;
    };
    return chart;
  };
  crayon.sparklineChart = function() {
    return crayon_sparklineChart();
  };
  crayon_sparklineChart = function() {
    function chart(selection) {
      selection.each(function() {
        var container = d3.select(this), g = container.select("g");
        if (g.empty()) {
          g = container.append("svg").attr("width", width).attr("height", height).append("g");
          xScale.range([ axisMargin, width - axisMargin ]);
          yScale.range([ height - axisMargin, axisMargin ]);
          var xAxis = g.append("g").attr("class", "x sparkline-axis");
          var yAxis = g.append("g").attr("class", "y sparkline-axis");
          xAxis.append("path").attr("d", "M0,0V0H" + width + "V0").attr("transform", "translate(0," + (height - axisMargin) + ")");
          yAxis.append("path").attr("d", "M0," + height + "H0V0," + height + "H0").attr("transform", "translate(" + axisMargin + ",0)");
        }
        xScale.domain(d3.extent(data, function(d) {
          return d.x;
        }));
        yScale.domain([ 0, d3.max(data, function(d) {
          return d.y;
        }) ]);
        var line = g.selectAll(".sparkline-chart").data([ data ]), lineEnter = line.enter().append("path").style("stroke", "#d04d55").style("fill", "none").attr("class", "sparkline-chart").attr("d", linePaint), lineExit = line.exit().remove(), lineUpdate = line.attr("class", "sparkline-chart").attr("d", linePaint);
      });
    }
    function X(d) {
      return xScale(d.x);
    }
    function Y(d) {
      return yScale(d.y);
    }
    var width = 200, height = 50, axisMargin = 5, x = function(d, i) {
      return d[i];
    }, y = function(d, i) {
      return d[i];
    }, xScale = d3.scale.linear(), yScale = d3.scale.linear(), linePaint = d3.svg.line().x(X).y(Y);
    var data;
    chart.width = function(_) {
      if (!arguments.length) return width;
      width = _;
      return chart;
    };
    chart.height = function(_) {
      if (!arguments.length) return height;
      height = _;
      return chart;
    };
    chart.x = function(_) {
      if (!arguments.length) {
        return x;
      }
      x = _;
      return chart;
    };
    chart.y = function(_) {
      if (!arguments.length) {
        return y;
      }
      y = _;
      return chart;
    };
    chart.xScale = function(_) {
      if (!arguments.length) {
        return xScale;
      }
      xScale = _;
      return chart;
    };
    chart.yScale = function(_) {
      if (!arguments.length) {
        return yScale;
      }
      yScale = _;
      return chart;
    };
    chart.data = function(_) {
      if (!arguments.length) return data;
      var keys = d3.keys(_[0]);
      data = _.map(function(d) {
        return {
          x: x.call(_, d, keys[0]),
          y: y.call(_, d, keys[1])
        };
      });
      return chart;
    };
    return chart;
  };
})();