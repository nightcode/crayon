crayon.barChart = function() {
  return crayon_chart().chart(crayon_barChart());
};

crayon_barChart = function() {

  var width = 400,
      height = 200,
      xScale = d3.scale.ordinal(),
      yScale = d3.scale.linear(),
      xAxis = crayon.axis().scale(xScale).orient("horizontal"),
      yAxis = crayon.axis().scale(yScale).orient("vertical"),
      series,
      seriesNames,
      colors,
      xTickFormat = function(d) { return d; };

  function chart(selection) {
    selection.each(function() {
      var container = d3.select(this),
          g = container.select("g");
      
      if (g.empty()) {
        g = container.append("g");
        g.append("g").attr("class", "x bar-axis").attr("transform", "translate(0," + height + ")").append("path").attr("d", "M0,0V0H" + width + "V0");
        g.append("g").attr("class", "y bar-axis").attr("transform", "translate(0,0)");
        g.append("g").attr("class", "bars-chart");
           
        colors.filter(function(d, i) {
          return seriesNames.length > i && !seriesNames[i].disabled;
        });
        
        var count = series[0].length;
        var actualWidth = (width / count < 70) ? width : 70 * count;
        
        yScale.range([height, 10]);
        yAxis.ticks(d3.max([2, height / 50])).tickSize(width).tickPosition(width);
        
        // this hack for calculating y axis margin
        yScale.domain([0, d3.max(d3.merge(series), function(d) { return d.y; })]).nice();
        g.select(".y.bar-axis").call(yAxis);
        var tickWidth = [];
        g.select(".y.bar-axis").selectAll("text").each(function (d) {
          tickWidth.push(d3.select(this).node().getComputedTextLength());
        });
        var tickMargin = d3.max(tickWidth);
        
        xScale.rangeRoundBands([0, actualWidth - tickMargin], .3).domain(d3.merge(series).map(function(d) { return d.x; }));
        xAxis.tickFormat(xTickFormat);        
      }      

      var filteredSeries = series.filter(function(d, i) { return (!seriesNames[i].disabled); });

      var mergedFilteredSeries = d3.merge(filteredSeries);      
      xScale.domain(mergedFilteredSeries.map(function(d) { return d.x; }));
      yScale.domain([0, d3.max(mergedFilteredSeries, function(d) { return d.y; })]).nice();
            
       var xWidthScale = d3.scale.ordinal()
            .domain(seriesNames.map(function(d) { return d.key; })
              .filter(function(d, i) { return !(seriesNames[i].disabled); }))
            .rangeRoundBands([0, xScale.rangeBand()]);
      
      g.select(".x.bar-axis").call(xAxis);
      g.select(".y.bar-axis").call(yAxis);
           
      var barsChart = g.select(".bars-chart");
      
      var layers = barsChart.selectAll(".bar-chart")
          .data(filteredSeries.length > 0 ? d3.layout.stack()(filteredSeries) : []);
      layers.enter().append("g")
          .attr("class", "bar-chart");
      layers.style("fill", function(d, i) { return colors(i); })
          .attr("transform", function(d, i) { return "translate(" + i * xWidthScale.rangeBand() + ",0)"; })
          .on("mouseover", function(d, i) {             
            barsChart.append("g")
                .attr("class", "tooltip")
                .attr("transform", function() { return "translate(" + i * xWidthScale.rangeBand() + ",0)"; })
          }, true);
      layers.exit().remove();
      
      var bars = layers.selectAll(".bar-chart rect").data(function(d) { return d; });
      bars.enter().append("rect")
          .on("mouseout", function() { barsChart.selectAll(".tooltip").remove(); });
      bars.attr("x", function(d) { return xScale(d.x); })
          .attr("y", function(d) { return yScale(d.y); })
          .attr("width", xWidthScale.rangeBand())
          .attr("height", function(d) { return height - yScale(d.y); })
          .on("mouseover", function(d) {                                    
            var x = xScale(d.x),
                y = yScale(d.y);            
        
            var gTooltip = barsChart.selectAll(".tooltip"),
                tooltipPath = gTooltip.append("path");

            var xValue = gTooltip.append("text").attr().text(d.x),
                yValue = gTooltip.append("text").attr().text(d.y);
            
            var xSvgRect = xValue.node().getExtentOfChar(0),
                ySvgRect = yValue.node().getExtentOfChar(0);
            
            var w = d3.max([xValue.node().getComputedTextLength(), yValue.node().getComputedTextLength()]),
                h = xSvgRect.height + ySvgRect.height;
                       
            var tooltip = crayon.tooltip();
            
            var xDirection = (x + w + tooltip.margin()*2 > width) ? "w" : "e",
                yDirection = (y - h - tooltip.margin()*2 > 0) ? "n" : "s";
            if (xDirection === "e") {
              x += xWidthScale.rangeBand();              
            }
            
            tooltip.orient(yDirection + xDirection);            
            tooltipPath.attr("d", tooltip(x, y, w, h));

            var tooltipRect = tooltip.rect(x, y, w, h);
            
            console.log(xSvgRect);
            
            xValue.attr("x", tooltipRect.w)
                .attr("y", tooltipRect.n + xSvgRect.height);
            yValue.attr("x", tooltipRect.w)
                .attr("y", tooltipRect.n + xSvgRect.height * 2);
          }) 
      ;
      bars.exit().remove();
    });
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

  chart.xScale = function(_) {
    if (!arguments.length) { return xScale; }
    xScale = _;
    return chart;
  };

  chart.yScale = function(_) {
    if (!arguments.length) { return yScale; }
    yScale = _;
    yAxis.scale(yScale);
    return chart;
  };

  chart.xTickFormat = function(_) {
    if (!arguments.length) { return xTickFormat; }
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
