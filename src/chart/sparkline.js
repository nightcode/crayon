crayon.sparklineChart = function() {
  return crayon_sparklineChart();
};

crayon_sparklineChart = function() {
  
  var width = 200,
      height = 50,
      axisMargin = 5,
      x = function(d, i) { return d[i]; },
      y = function(d, i) { return d[i]; },
      xScale = d3.scale.linear(),
      yScale = d3.scale.linear(),
      linePaint = d3.svg.line().x(X).y(Y);
      
  var data;
  
  function chart(selection) {
    selection.each(function() {
      var container = d3.select(this),            
          g = container.select("g");
      
      if (g.empty()) {        
        g = container.append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g");

        xScale.range([axisMargin, width - axisMargin]);
        yScale.range([height - axisMargin, axisMargin]);
        
        var xAxis = g.append("g").attr("class", "x sparkline-axis");
        var yAxis = g.append("g").attr("class", "y sparkline-axis");

        xAxis.append("path")
            .attr("d", "M0,0V0H" + width + "V0")
            .attr("transform", "translate(0," + (height - axisMargin) + ")");

        yAxis.append("path")
            .attr("d", "M0," + height + "H0V0," + height + "H0")
            .attr("transform", "translate(" + axisMargin + ",0)"); 
      } 
      
      xScale.domain(d3.extent(data, function(d) { return d.x; }));
      yScale.domain([0, d3.max(data, function(d) { return d.y; })]);
        
      var line = g.selectAll(".sparkline-chart").data([data]),
          lineEnter = line.enter()
              .append("path")
              .style("stroke", "#d04d55")
              .style("fill", "none")
              .attr("class", "sparkline-chart")
              .attr("d", linePaint),
          lineExit = line.exit().remove(),
          lineUpdate = line
              .attr("class", "sparkline-chart")
              .attr("d", linePaint); 
      
    });
  }
  
  function X(d) { 
    return xScale(d.x); 
  } 

  function Y(d) { 
    return yScale(d.y); 
  } 
  
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
  
  chart.x = function (_) {
    if (!arguments.length) { return x; }
    x = _;
    return chart;
  };

  chart.y = function (_) {
    if (!arguments.length) { return y; }
    y = _;
    return chart;
  };

  chart.xScale = function(_) {
    if (!arguments.length) { return xScale; }
    xScale = _;
    return chart;
  };
  
  chart.yScale = function(_) {
    if (!arguments.length) { return yScale; }
    yScale = _;
    return chart;
  };
  
   chart.data = function(_) {
    if (!arguments.length) return data;
    var keys = d3.keys(_[0]);
      
    data = _.map(function(d) {
      return {x: x.call(_, d, keys[0]), y: y.call(_, d, keys[1])}; 
    });
    return chart;
  };
  
  return chart;
};
