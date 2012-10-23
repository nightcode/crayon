crayon.legend = function() {
  
  var dispatch = d3.dispatch("onLegendClick");
  
  var colors = crayon.colors(),
      width = 400,
      height = 30,
      margin = {top:0, right:5, bottom:0, left:5},
      markerLength = 7,
      boxDistance = 8,
      textMargin = margin.left + margin.left + markerLength;
  
  function legend_(selection) {    
    selection.each(function(seriesNames) {
      var g = d3.select(this);
      
      g.append("rect")
          .style("stroke-width", "1")
          .attr("class", "legend-container")
          .attr("x", "1")
          .attr("y", "0") 
          .attr("width", width - 2) // 2 - stroke-width adjustment
          .attr("height", height - 2); // 2 - stroke-width adjustment
      
      var legend = g.selectAll(".legend").data(seriesNames),
          legendEnter = legend.enter().append("g").attr("class", "legend-box")
              .on("click", function(d, i) {
                var rect = d3.select(this).selectAll(".legend-rect");
                rect.attr("class", (d.disabled) ? "legend-rect" : "legend-rect disabled");
                dispatch.onLegendClick(d, i); 
              }),
          legendExit = legend.exit().remove(),
          legendUpdate = legend;
      
      legendEnter.append("rect")
          .attr("class", "legend-rect")          
          .attr("ry", "3")
          .attr("x", "0")
          .attr("y", "0")
          .attr("height", "20"); 
      
      var legendTitle = legendEnter.append("g");
      legendTitle.append("path")
          .style("stroke", function(d, i) { return colors(i); })
          .attr("class", "legend-line")
          .attr("d", "m " + margin.left + ",10 " + markerLength + ",0");
      legendTitle.append("text")
          .text(function (d) { return d.key; })
          .attr("class", "legend-text")
          .attr("text-anchor", "start")
          .attr("dy", "13")
          .attr("dx", textMargin); 
      
      var titlesWidths = [];
      legendTitle.selectAll(".legend-text")
          .each(function(d) { 
            titlesWidths.push(d3.select(this).node().getComputedTextLength());
          });

      legendUpdate.each(function(d,i) {
        d3.select(this)
            .select(".legend-rect")
            .attr("width", (titlesWidths[i] + textMargin + margin.right));
      });
      
      var distance = 10;
      legendUpdate.attr("transform", function (d, i) { 
        var position = distance;
        distance += titlesWidths[i] + textMargin + margin.right + boxDistance;
        return "translate(" + position + ",4)";
      });        
    });
  }
  
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
