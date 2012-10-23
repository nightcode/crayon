crayon.colors = function() {
  return crayon_colors(["#4fa55e", "#c45c5b", "#e7a847", "#4b99eb", "#a05eb5", "#8983ef"]);
};

function crayon_colors(domain) {
  
  var filter;
  
  function color(index) {
    var filtered = (filter) ? domain.filter(filter) : domain;
    return filtered[index % filtered.length];
  }
  
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
