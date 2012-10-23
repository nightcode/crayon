crayon.bar = function() {

  var x = function(d,i,layer) { return d.x; },
      y = function(d,i,layer) { return 0;},
      height = function(d,i,layer) { return d.y; },
      width = function(d,i,layer) { return 7; };
  
  function bar(data, layer) {
    var path = [],
        i = -1,
        n = data.length,
        d;    
    while (++i < n) {
      d = data[i];
      path.push("M", x(d,i,layer), ",", y(d,i,layer), "V", height(d,i,layer), "h", width(d,i,layer), "V", y(d,i,layer));
    }
    return path.join("");
  }
  
   bar.x = function (_) {
    if (!arguments.length) { return x; }
    x = _;
    return bar;
  };

  bar.y = function (_) {
    if (!arguments.length) { return y; }
    y = _;
    return bar;
  };

  bar.height = function(_) {
    if (!arguments.length) { return height; }
    height = _;
    return bar;
  };
  
  bar.width = function(_) {
    if (!arguments.length) { return width; }
    width = _;
    return bar;
  };
  
  return bar;
};
