function SalesMap() {
  EEDFMap.call(this);
}

SalesMap.prototype = Object.create(EEDFMap.prototype, {
  constructor: { value: SalesMap }
});

SalesMap.prototype.filterTowns = function(town) {
  // show town only if there is a sale
  return !!sales.find(function(sale) { return sale["code_insee"] === town.properties["insee"]; });
}

SalesMap.prototype.popupCentre = function(sale, town, layer) {
  return L.popup({
    className: "sale-popup"
  }).setLatLng(layer.getBounds().getCenter())
    .setContent("<h4>" + sale["nom"] + "</h4>"
      + "<p class='town'>" + sale["code_insee"] + " " + town.properties["nom"] + "</p>");
}

SalesMap.prototype.addMarker = function(sale, layer, popup) {
  var awesomeMarker = L.AwesomeMarkers.icon({
    icon: "euro-sign",
    prefix: "fa",
    markerColor: "darkred"
  });
  L.marker(layer.getBounds().getCenter(), {
    icon: awesomeMarker
  }).bindPopup(popup)
    .addTo(map);
}

SalesMap.prototype.addTooltip = function(sale, layer) {
  // custom direction
  var direction = "right";
  if      (sale["nom"] === "Clermont Ferrand")        direction = "left";
  else if (sale["nom"] === "Saint Aubin des Forges")  direction = "bottom";
  else if (sale["nom"] === "Trans en Provence")       direction = "bottom";
  layer.bindTooltip(sale["nom"], {
    permanent: true, 
    interactive: true,
    className: "sale-tooltip",
    direction: direction
  }).addTo(map);
}

SalesMap.prototype.addListener = function(layer, popup) {
  layer.on("click", function(e) {
    map.openPopup(popup);
  });
}

SalesMap.prototype.onEachTown = function(town, layer) {
  // find sale in town
  var sale = sales.find(function(sale) { return sale["code_insee"] === town.properties["insee"]; });
  // create popup
  var popup = SalesMap.prototype.popupCentre(sale, town, layer);
  // add circle marker
  SalesMap.prototype.addMarker(sale, layer, popup);
  // add tooltip
  SalesMap.prototype.addTooltip(sale, layer);
  // add listener
  SalesMap.prototype.addListener(layer, popup);
}

SalesMap.prototype.styleTown = function(town) {
  return {
    stroke: false,
    fill: false
  };
}

SalesMap.prototype.infoUpdate = function(properties) {
  // set title
  info._div.innerHTML = "<h4 class='title'>" + titles["SalesMap"] + "</h4>";
}
