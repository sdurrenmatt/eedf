function PropertiesMap() {
  EEDFMap.call(this);
}

PropertiesMap.prototype = Object.create(EEDFMap.prototype, {
  constructor: { value: PropertiesMap }
});

PropertiesMap.prototype.filterTowns = function(town) {
  // show town only if there is a property
  return !!properties.find(function(property) { return property["code_insee"] === town.properties["insee"]; });
}

PropertiesMap.prototype.popupCentre = function(property, town, layer) {
  return L.popup({
    className: "property-popup"
  }).setLatLng(layer.getBounds().getCenter())
    .setContent("<h4>" + property["nom"] + "</h4>" 
      + "<p class='property-" + classNames[property["type"]] + "'>" + property["type"] + "</p>"
      + "<p class='town'>" + property["code_insee"] + " " + town.properties["nom"] + "</p>");
}

PropertiesMap.prototype.addMarker = function(property, layer, popup) {
  L.circleMarker(layer.getBounds().getCenter(), {
    color: colors[property["type"]],
    radius: 1,
    fillOpacity: 1
  }).bindPopup(popup)
    .addTo(map);
}

PropertiesMap.prototype.addTooltip = function(property, layer) {
  // custom direction
  var direction = "top";
  if      (property["nom"] === "Bécours")             direction = "left";
  else if (property["nom"] === "Blausasc")            direction = "right";
  else if (property["nom"] === "Bled Limoges")        direction = "right";
  else if (property["nom"] === "Bordeaux Mouneyra")   direction = "right";
  else if (property["nom"] === "Bussac")              direction = "right";
  else if (property["nom"] === "Castelnau")           direction = "left";
  else if (property["nom"] === "Chateauvieux")        direction = "bottom";
  else if (property["nom"] === "Coûteron")            direction = "left";
  else if (property["nom"] === "Cultures")            direction = "right";
  else if (property["nom"] === "Dolus d'Oléron")      direction = "left";
  else if (property["nom"] === "Etueffont")           direction = "left";
  else if (property["nom"] === "Fabian")              direction = "right";
  else if (property["nom"] === "Faimbe")              direction = "right";
  else if (property["nom"] === "Fief Guesdon")        direction = "left";
  else if (property["nom"] === "Foucheval")           direction = "left";
  else if (property["nom"] === "Humbécourt")          direction = "right";
  else if (property["nom"] === "La Glène")            direction = "bottom";
  else if (property["nom"] === "La Planche")          direction = "left";
  else if (property["nom"] === "Le Fontenil")         direction = "left";
  else if (property["nom"] === "Les Révotes")         direction = "right";
  else if (property["nom"] === "Lespone")             direction = "left";
  else if (property["nom"] === "Mas Gustave")         direction = "bottom";
  else if (property["nom"] === "Millau")              direction = "right";
  else if (property["nom"] === "Montireau")           direction = "left";
  else if (property["nom"] === "Morbecque")           direction = "bottom";
  else if (property["nom"] === "Noisy Le Grand")      direction = "left";
  else if (property["nom"] === "Pessac")              direction = "left";
  else if (property["nom"] === "Queaux")              direction = "right";
  else if (property["nom"] === "Saint Auban")         direction = "left";
  else if (property["nom"] === "SV Chalon")           direction = "left";
  else if (property["nom"] === "Trets")               direction = "bottom";
  else if (property["nom"] === "Villeconin")          direction = "right";
  layer.bindTooltip(property["nom"], {
    permanent: true, 
    interactive: true,
    direction: direction,
    className: "property-tooltip-" + classNames[property["type"]]
  }).addTo(map);
}

PropertiesMap.prototype.addListener = function(layer, popup) {
  layer.on("click", function(e) {
    map.openPopup(popup);
  });
}

PropertiesMap.prototype.onEachTown = function(town, layer) {
  // find property in town
  var property = properties.find(function(property) { return property["code_insee"] === town.properties["insee"]; });
  // create popup
  var popup = PropertiesMap.prototype.popupCentre(property, town, layer);
  // add circle marker
  PropertiesMap.prototype.addMarker(property, layer, popup);
  // add tooltip
  PropertiesMap.prototype.addTooltip(property, layer);
  // add listener
  PropertiesMap.prototype.addListener(layer, popup);
}

PropertiesMap.prototype.styleTown = function(town) {
  return {
    stroke: false,
    fill: false
  };
}

PropertiesMap.prototype.infoUpdate = function(properties) {
  // set title
  infos[viewId]._div.innerHTML = "<h4 class='title'>" + titles["PropertiesMap"] + "</h4>"
    + "<span class='bureau'>• Bureau</span>    "
    + "<span class='terrain'>• Terrain</span>    "
    + "<span class='groupe'>• Groupe</span>    "
    + "<br/><br/>"
    + "<span class='centre'>• Centre</span>    "
    + "<span class='centre-national'>• Centre national</span>    "
    + "<br/><br/>"
    + "<span class='en-vente'>• En vente</span>    "
    + "<span class='bail-emphyteotique'>• Bail emphytéotique</span>    "
}
