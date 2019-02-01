function LocalsMap() {
  EEDFMap.call(this);
}

LocalsMap.prototype = Object.create(EEDFMap.prototype, {
  constructor: { value: LocalsMap }
});

LocalsMap.prototype.filterTowns = function(town) {
  // show town only if there is a local group or a centre
  return !!locals.find(function(local) { return local["code_insee"] === town.properties["insee"]; })
    || !!centres.find(function(centre) { return centre["code_insee"] === town.properties["insee"]; });
}

LocalsMap.prototype.popupProperty = function(property, town, layer) {
  var className = property["type"] ? (property["type"] === "CENTRE" ? "centre" : "centre-national") : "groupe-local";
  var typeLabel = property["type"] ? (property["type"] === "CENTRE" ? "Centre bénévole" : "CPN") : "Groupe Local";
  return L.popup({
    className: "property-popup"
  }).setLatLng(layer.getBounds().getCenter())
    .setContent("<h4>" + property["nom"] + "</h4>"
      + "<p class='property-" + className + "'>" + typeLabel + "</p>"
      + "<p class='town'>" + property["code_insee"] + " " + town.properties["nom"] + "</p>");
}

LocalsMap.prototype.addMarker = function(property, layer, popup) {
  var awesomeMarker = L.AwesomeMarkers.icon({
    icon: property["type"] ? "home" : "map-pin",
    prefix: "fa",
    markerColor: property["type"] ? 
      (property["type"] === "CENTRE" ? "green" : "black") : "darkred"
  });
  var marker = L.marker(layer.getBounds().getCenter(), {
    icon: awesomeMarker
  }).bindPopup(popup)
    .addTo(map);
}

LocalsMap.prototype.addListener = function(layer, popup) {
  layer.on("click", function(e) {
    map.openPopup(popup);
  });
}

LocalsMap.prototype.onEachTown = function(town, layer) {
  // find local group or centre in town
  var property = locals.find(function(local) { return local["code_insee"] === town.properties["insee"]; })
    || centres.find(function(centre) { return centre["code_insee"] === town.properties["insee"]; });
  // create popup
  var popup = LocalsMap.prototype.popupProperty(property, town, layer);
  // add marker
  LocalsMap.prototype.addMarker(property, layer, popup);
  // add listener
  LocalsMap.prototype.addListener(layer, popup);
}

LocalsMap.prototype.styleTown = function(town) {
  return {
    stroke: false,
    fill: false
  };
}

LocalsMap.prototype.infoUpdate = function(properties) {
  // set title
  info._div.innerHTML = "<h4 class='title'>" + titles["LocalsMap"] + "</h4>"
    + "<span class='groupe-local'>• Groupe local</span>    <span class='centre'>• Centre bénévole</span>    <span class='centre-national'>• CPN</span>";
}
