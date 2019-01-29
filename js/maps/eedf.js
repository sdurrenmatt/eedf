function EEDFMap() {}

EEDFMap.prototype.load = function() {
  this.createLoader();
  this.loadFeatures();
  this.loadInfo();
  this.deactivateLoader();
}

EEDFMap.prototype.createLoader = function() {
  map.spin(true, spinConfig.options);
}

EEDFMap.prototype.loadFeatures = function() {
  // load departments data
  this.loadDepartments();
  // load towns data
  this.loadTowns();
  // add features
  features[viewId] = L.featureGroup([departments, towns]);
}

EEDFMap.prototype.loadDepartments = function() {
  departments = new L.Shapefile("http://osm13.openstreetmap.fr/~cquest/openfla/export/departements-20180101-shp.zip", {
    style: this.styleDepartment
  });
}

EEDFMap.prototype.loadTowns = function() {
  towns = new L.geoJSON(communes, {
    filter: this.filterTowns,
    onEachFeature: this.onEachTown,
    style: this.styleTown
  });
}

EEDFMap.prototype.deactivateLoader = function() {
  map.once("data:loaded", function() {
    map.spin(false);
  });
}

EEDFMap.prototype.loadInfo = function() {
  infos[viewId] = L.control();
  infos[viewId].onAdd = this.infoOnAdd;
  infos[viewId].update = this.infoUpdate;
}

EEDFMap.prototype.infoOnAdd = function(map) {
  this._div = L.DomUtil.create("div", "info");
  this.update();
  return this._div;
};

EEDFMap.prototype.infoUpdate = function(properties) {
  this._div.innerHTML = "";
}

EEDFMap.prototype.resetFeature = function(e) {
  features[viewId].resetStyle(e.target);
  infos[viewId].update();
}

EEDFMap.prototype.styleDepartment = function() {
  return {
    color: "#AFAFAF",
    weight: 1,
    fillOpacity: 0.25
  };
}

EEDFMap.prototype.popupCentre = function(centre, town, layer) {
  return L.popup({
    className: "centre-popup"
  }).setLatLng(layer.getBounds().getCenter())
    .setContent("<h4>" + centre["nom"] + "</h4>" 
      + "<p class='centre-" + centre["type"] + "'>" + (centre["type"] === "CENTRE" ? "Centre bénévole" : "CPN") + "</p>"
      + "<p class='town'>" + centre["code_insee"] + " " + town.properties["nom"] + "</p>");
}

EEDFMap.prototype.markerCentre = function(centre) {
  return L.AwesomeMarkers.icon({
    icon: "home",
    prefix: "fa",
    markerColor: centre["type"] === "CENTRE" ? "green" : "black"
  });
}

EEDFMap.prototype.addMarkerCentre = function(layer, popup, awesomeMarker) {
  L.marker(layer.getBounds().getCenter(), {
    icon: awesomeMarker
  }).bindPopup(popup)
    .addTo(map);
}

EEDFMap.prototype.displayCentre = function(town, layer) {
  // find centre in town
  var centre = centres.find(function(centre) { return centre["code_insee"] === town.properties["insee"]; });
  // create popup
  var popup = this.popupCentre(centre, town, layer);
  // create awesome marker
  var awesomeMarker = this.markerCentre(centre);
  // add marker
  this.addMarkerCentre(layer, popup, awesomeMarker);
}