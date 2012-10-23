crayon_chart = function() {

  var margin = {top:20, right:20, bottom:30, left:20},
      width = 400,
      height = 200,
      colors = crayon.colors(),
      legendPaint = crayon.legend(),
      legendVisible = true,
      x = function(d, i) { return d[i]; },
      y = function(d, i) { return d[i]; }, 
      chartPaint,
      data;
  
  function chart_(selection) {
    selection.each(function () {                         
      var that = this;
      
      var container = d3.select(that), 
          g = container.select("g"),
          gChart = g.select(".chart");

      legendPaint.colors(colors).width(width);
      var legendHeight = (legendVisible) ? legendPaint.height() : 1;
      chartPaint.colors(colors)
          .width(width - margin.left - margin.right)
          .height(height - margin.top - margin.bottom - legendHeight); 
      
      if (g.empty()) {             
        g = container
            .append("svg").attr("width", width).attr("height", height)
            .append("g");
                       
        g.append("g")
            .attr("class", "chart")
            .attr("transform", "translate(0,0)");
        g.select(".chart")
          .append("rect")
            .style("stroke-width", "1")
            .attr("class", "chart-container")
            .attr("x", "1")
            .attr("y", "1") 
            .attr("width", width - 2) // 2 - stroke-width adjustment 
            .attr("height", height - legendHeight - 1); // 1 - stroke-height adjustment
        
        gChart = g.select(".chart");
        gChart.append("g")
            .attr("class", "chart-box")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        if (legendVisible) {
          var gLegend = g.append("g")
              .attr("class", "legendPaint")
              .attr("transform", "translate(0, " + (height - legendHeight) + ")"); 
          gLegend.datum(chartPaint.seriesNames()).call(legendPaint);        
          
          legendPaint.dispatch.on('onLegendClick', function (d) {
            d.disabled = !d.disabled;
            selection.transition().call(chart_);
          });
        }
      }
      
      gChart.select("g").call(chartPaint); 
    });
  }

  chart_.margin = function (_) {
    if (!arguments.length) { return margin; }
    margin = _;
    return chart_;
  };

  chart_.width = function(_) {
    if (!arguments.length) { return width; }
    width = _;
    return chart_;
  };

  chart_.height = function(_) {
    if (!arguments.length) { return height; }
    height = _;
    return chart_;
  };
  
  chart_.x = function (_) {
    if (!arguments.length) { return x; }
    x = _; 
    return chart_;
  };

  chart_.y = function (_) {
    if (!arguments.length) { return y; }
    y = _;
    return chart_;
  };

  chart_.xScale = function(_) {
    if (!arguments.length) { return chartPaint.xScale(); }
    chartPaint.xScale(_);
    return chart_;
  };
  
  chart_.yScale = function(_) {
    if (!arguments.length) { return chartPaint.yScale(); }
    chartPaint.yScale(_);
    return chart_;
  };

  chart_.xTickFormat = function(_) {
    if (!arguments.length) { return chartPaint.xTickFormat(); }
    chartPaint.xTickFormat(_);
    return chart_;
  };
  
  chart_.colors = function(_) {
    if (!arguments.length) { return colors.domain(); }
    colors.domain(_);
    return chart_;
  };
  
  chart_.legendVisible = function(_) {
    if (!arguments.length) { return legendVisible; }
    legendVisible = _;
    return chart_; 
  };
  
  chart_.data = function(_) {
    if (!arguments.length) { return data; }
    data = _;
    var keys = d3.keys(data[0]);
    var seriesNames = keys 
        .filter(function(d, i) { return i !== 0; })
        .map(function (p) { return {key: p, disabled: false}; })
        .sort();
      
    var series = seriesNames.map(function(series) {
      return data.map(function(d) { 
        return {x: x.call(data, d, keys[0]), y: y.call(data, d, series.key)}; 
      });
    });

    chartPaint.seriesNames(seriesNames);
    chartPaint.series(series);
    return chart_;
  };
  
  chart_.chart = function(_) {
    if (!arguments.length) { return chartPaint; }
    chartPaint = _;
    return chart_;
  };
  
  return chart_;
};
