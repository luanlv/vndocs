Array.prototype.getItemByParam = function(paramPair) {
  var key = Object.keys(paramPair)[0];
  return this.find(function(item){return ((item[key] == paramPair[key]) ? true: false)});
}

var buildUrls = function(category){
  var result = {};


  var parentUrl = function(slug){
    if(slug === "NONE") return "/c";
    if(result.slug !== undefined){
      return result.slug
    } else {
      var parentSlug = category.getItemByParam(
          {slug: slug}
      );
      return parentUrl(parentSlug.sku.slug) + "/" + slug;
    }
  };

  for(var i = 0, max = category.length; i < max; i++){
    result[category[i].slug] = parentUrl(category[i].slug)
  }
  return result;
}