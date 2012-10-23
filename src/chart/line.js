crayon.lineChart = function() {
  return crayon_chart().chart(crayon_lineChart());
};

crayon_lineChart = function() {  
  
  var width = 400,
      height = 200,
      xScale = d3.scale.linear(),
      yScale = d3.scale.linear(),
      xAxis = crayon.axis().scale(xScale).orient("horizontal"),      
      yAxis = crayon.axis().scale(yScale).orient("vertical"), 
      linePaint = d3.svg.line().x(function(d) { return xScale(d.x); }).y(function(d) { return yScale(d.y); }),
      series,
      seriesNames,
      colors,
      tickSize = function (d, i) { return i != 0 ? -height : 0;};
  
  function chart(selection) {
    selection.each(function() {
      var container = d3.select(this),            
          g = container.select("g");
      
      if (g.empty()) {
        g = container.append("g");        
        g.append("g").attr("class", "x line-axis").attr("transform", "translate(0," + height + ")");
        g.append("g").attr("class", "y line-axis").attr("transform", "translate(0,0)");
        g.append("g").attr("class", "lines-chart");
        
        colors.filter(function(d, i) {
          return seriesNames.length > i && !seriesNames[i].disabled;
        });

        yScale.range([height, 10]);
        yAxis.ticks(d3.max([2, height / 50]));
        
        // this hack for calculating y axis margin
        yScale.domain([0, d3.max(d3.merge(series), function(d) { return d.y; })]).nice();                
        g.select(".y.line-axis").call(yAxis);
        var tickWidth = [];
        g.select(".y.line-axis").selectAll("text").each(function (d) {
          tickWidth.push(d3.select(this).node().getComputedTextLength());
        });
        var tickMargin = d3.max(tickWidth); 
        g.attr("transform", "translate(" + tickMargin + ",0)");

        xScale.range([0, width - tickMargin]);
        xAxis.tickSize(tickSize, 0);
        yAxis.tickSize(width - tickMargin);
      }
        
      var filteredSeries = series.filter(function(d, i) { return (!seriesNames[i].disabled); });
      
      var mergedFilteredSeries = d3.merge(filteredSeries);
      xScale.domain(d3.extent(mergedFilteredSeries, function(d) { return d.x; }));
      yScale.domain([0, d3.max(mergedFilteredSeries, function(d) { return d.y; })]).nice(); 
              
      g.select(".x.line-axis").call(xAxis);
      g.select(".y.line-axis").call(yAxis); 
      
      var line = g.select(".lines-chart").selectAll(".line-chart").data(filteredSeries),
          lineEnter = line.enter()
              .append("path")
              .attr("class", "line-chart"),
          lineExit = line.exit().remove(),
          lineUpdate = line.style("stroke", function(p, i) { return colors(i); })
              .attr("d", linePaint);                
    });    
  }
  
  chart.width = function(_) {
    if (!arguments.length) { return width; }
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) { return height; }
    height = _;
    return chart;
  };

  chart.xScale = function(_) {
    if (!arguments.length) { return xScale; }
    xScale = _;
    xAxis.scale(xScale);
    return chart;
  };
  
  chart.yScale = function(_) {
    if (!arguments.length) { return yScale; }
    yScale = _;
    yAxis.scale(yScale);
    return chart;
  };
  
  chart.series = function(_) {
      if (!arguments.length) { return series; }
      series = _;
      return chart;
  }; 
  
  chart.seriesNames = function(_) {
    if (!arguments.length) { return seriesNames; }
    seriesNames = _;
    return chart;     
  };  
  
  chart.colors = function(_) {
    if (!arguments.length) { return colors; }
    colors = _;
    return chart; 
  }; 
  
  return chart;
};
