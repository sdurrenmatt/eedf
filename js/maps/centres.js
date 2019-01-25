function CentresMap() { 
  EEDFMap.call(this);
}

function displayCentre(town, layer) {
  // find centre in town
  var centre = centres.find(function(centre) { return centre["code_insee"] === town.properties["insee"]; });
  // create popup
  var popup = L.popup({
    className: "centre-popup"
  }).setLatLng(layer.getBounds().getCenter())
    .setContent("<h4>" + centre["nom"] + "</h4>" 
    + "<p class='centre-" + centre["type"] + "'>" + (centre["type"] === "CENTRE" ? "Centre bénévole" : "CPN") + "</p>"
    + "<p class='town'>" + centre["code_insee"] + " " + town.properties["nom"] + "</p>");
  // create awesome marker
  var awesomeMarker = L.AwesomeMarkers.icon({
    icon: "home",
    prefix: "fa",
    markerColor: centre["type"] === "CENTRE" ? "green" : "black"
  });
  // add marker
  L.marker(layer.getBounds().getCenter(), {
    icon: awesomeMarker
  }).bindPopup(popup)
    .addTo(map);
}

CentresMap.prototype = Object.create(EEDFMap.prototype, {
  constructor: { value: CentresMap }
});

CentresMap.prototype.loadFeatures = function() {
  // load towns data
  features[viewId] = new L.Shapefile("http://osm13.openstreetmap.fr/~cquest/openfla/export/communes-20150101-100m-shp.zip", {
    filter: this.filterTowns,
    onEachFeature: this.onEachTown,
    style: this.styleTown
  });
}

CentresMap.prototype.filterTowns = function(town) {
  // show town only if there is a centre
  return !!centres.find(function(centre) { return centre["code_insee"] === town.properties["insee"]; });
}

CentresMap.prototype.onEachTown = function(town, layer) {
  // find centre in town
  var centre = centres.find(function(centre) { return centre["code_insee"] === town.properties["insee"]; });
  // create popup
  var popup = L.popup({
    className: "centre-popup"
  }).setLatLng(layer.getBounds().getCenter())
    .setContent("<h4>" + centre["nom"] + "</h4>" 
    + "<p class='centre-" + centre["type"] + "'>" + (centre["type"] === "CENTRE" ? "Centre bénévole" : "CPN") + "</p>"
    + "<p class='town'>" + centre["code_insee"] + " " + town.properties["nom"] + "</p>");
  // add circle marker
  L.circleMarker(layer.getBounds().getCenter(), {
    color: centre["type"] === "CENTRE" ? "#72b026" : "#000",
    radius: 1,
    fillOpacity: 1
  }).bindPopup(popup)
    .addTo(map);
  // custom direction
  var direction = "top";
  if      (centre["nom"] === "Blausasc")    direction = "right";
  else if (centre["nom"] === "Chalmazel")   direction = "bottom";
  else if (centre["nom"] === "Etueffont")   direction = "left";
  else if (centre["nom"] === "Foucheval")   direction = "left";
  else if (centre["nom"] === "Fabian")      direction = "right";
  else if (centre["nom"] === "La Planche")  direction = "left";
  else if (centre["nom"] === "Le Fontenil") direction = "left";
  else if (centre["nom"] === "Les Révotes") direction = "right";
  else if (centre["nom"] === "Lespone")     direction = "left";
  else if (centre["nom"] === "Queaux")      direction = "right";
  // add tooltip
  layer.bindTooltip(centre["nom"], {
    permanent: true, 
    interactive: true,
    direction: direction,
    className: "centre-tooltip-" + centre["type"]
  }).addTo(map);
  // add listener on layer
  layer.on("click", function(e) {
    map.openPopup(popup);
  });
}

CentresMap.prototype.styleTown = function(town) {
  return {
    stroke: false,
    fill: false
  };
}

CentresMap.prototype.infoUpdate = function(properties) {
  // set title
  infos[viewId]._div.innerHTML = "<h4 class='title'>" + titles["CentresMap"] + "</h4>"
    + "<span class='centre-benevole'>Centre bénévole</span>  |  <span class='cpn'>CPN</span>";
}
