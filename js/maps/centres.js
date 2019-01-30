function CentresMap() {
  EEDFMap.call(this);
}

CentresMap.prototype = Object.create(EEDFMap.prototype, {
  constructor: { value: CentresMap }
});

CentresMap.prototype.filterTowns = function(town) {
  // show town only if there is a centre
  return !!centres.find(function(centre) { return centre["code_insee"] === town.properties["insee"]; });
}

CentresMap.prototype.addMarker = function(centre, layer, popup) {
  L.circleMarker(layer.getBounds().getCenter(), {
    color: colors[centre["type"]],
    radius: 1,
    fillOpacity: 1
  }).bindPopup(popup)
    .addTo(map);
}

CentresMap.prototype.addTooltip = function(centre, layer) {
  // custom direction
  var direction = "top";
  if      (centre["nom"] === "Blausasc")    direction = "right";
  else if (centre["nom"] === "Chalmazel")   direction = "right";
  else if (centre["nom"] === "Etueffont")   direction = "left";
  else if (centre["nom"] === "Foucheval")   direction = "left";
  else if (centre["nom"] === "Fabian")      direction = "right";
  else if (centre["nom"] === "La Planche")  direction = "left";
  else if (centre["nom"] === "Le Fontenil") direction = "left";
  else if (centre["nom"] === "Les Révotes") direction = "right";
  else if (centre["nom"] === "Lespone")     direction = "left";
  else if (centre["nom"] === "Queaux")      direction = "right";
  layer.bindTooltip(centre["nom"], {
    permanent: true, 
    interactive: true,
    direction: direction,
    className: "property-tooltip-" + classNames[centre["type"]]
  }).addTo(map);
}

CentresMap.prototype.addListener = function(layer, popup) {
  layer.on("click", function(e) {
    map.openPopup(popup);
  });
}

CentresMap.prototype.onEachTown = function(town, layer) {
  // find centre in town
  var centre = centres.find(function(centre) { return centre["code_insee"] === town.properties["insee"]; });
  // create popup
  var popup = CentresMap.prototype.popupCentre(centre, town, layer);
  // add circle marker
  CentresMap.prototype.addMarker(centre, layer, popup);
  // add tooltip
  CentresMap.prototype.addTooltip(centre, layer);
  // add listener
  CentresMap.prototype.addListener(layer, popup);
}

CentresMap.prototype.styleTown = function(town) {
  return {
    stroke: false,
    fill: false
  };
}

CentresMap.prototype.infoUpdate = function(properties) {
  // set title
  info._div.innerHTML = "<h4 class='title'>" + titles["CentresMap"] + "</h4>"
    + "<span class='centre'>• Centre bénévole</span>    <span class='centre-national'>• CPN</span>";
}
