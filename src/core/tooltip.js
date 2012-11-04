crayon.tooltip = function() {
  var orient = "ne",
      dx = 12,
      dy = 12,
      leftPart = 0.3,
      rightPart = 0.7,
      margin = 7;  
  
  function tooltip(x, y, width, height) {
    var path = [],
        xDirection,
        yDirection;
    
    switch (orient) {
      case "ne": {
        xDirection = 1;
        yDirection = 1;
        break;
      }
      case "se": {
        xDirection = 1;
        yDirection = -1;
        break;
      }
      case "sw": {
        xDirection = -1;
        yDirection = -1;
        break;
      }
      case "nw": {
        xDirection = -1;
        yDirection = 1;
        break;
      }
    }
        
    path.push("M", x, ",", y
        , "L", x + dx*xDirection, ",", y - dy*yDirection
        , "L", x - (leftPart*width+margin)*xDirection, ",", y - dy*yDirection
        , "L", x - (leftPart*width+margin)*xDirection, ",", y - (dy+height+2*margin)*yDirection
        , "L", x + (rightPart*width+margin)*xDirection, ",", y - (dy+height+2*margin)*yDirection
        , "L", x + (rightPart*width+margin)*xDirection, ",", y - dy*yDirection
        , "L", x + dx*2*xDirection, ",", y - dy*yDirection, "Z");    
    return path.join("");    
  }
  
  tooltip.rect = function(x, y, width, height) {
    var n, e, s, w;
    switch (orient) {      
      case "ne": {
        s = y - dy - margin;
        n = s - height;
        e = x + rightPart*width;
        w = x - leftPart*width;
        break;
      }
      case "se": {
        n = y + dy + margin;
        s = n + height;
        e = x + rightPart*width;
        w = x - leftPart*width;
        break;
      }
      case "sw": {
        n = y + dy + margin;
        s = n + height;
        e = x + leftPart*width;
        w = x - rightPart*width;
        break;
      }
      case "nw": {
        s = y - dy - margin;
        n = s - height;
        e = x + leftPart*width;
        w = x - rightPart*width;
        break;
      }
    } 
    return {n:n, w:w, e:e, s:s};
  };
  
  tooltip.margin = function(x) {
    if (!arguments.length) return margin;
    margin = x;
    return tooltip;
  };
  
  tooltip.orient = function(x) {
    if (!arguments.length) return orient;
    orient = x;
    return tooltip;
  };
  
  return tooltip;
};
