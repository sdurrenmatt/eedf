function EEDFMap() {}

const classNames = {
  "Bail Emphytéotique": "bail-emphyteotique",
  "Bureau": "bureau",
  "Centre": "centre",
  "CENTRE": "centre",
  "Centre National": "centre-national",
  "CPN": "centre-national",
  "Groupe": "groupe",
  "En vente": "en-vente",
  "Terrain": "terrain"
}

const colors = {
  "Bail Emphytéotique": "#791CF8",
  "Bureau": "#003366",
  "Centre": "#72B026",
  "CENTRE": "#72B026",
  "Centre National": "#000000",
  "CPN": "#000000",
  "Groupe": "#ED7F10",
  "En vente": "#960018",
  "Terrain": "#095228"
};

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
  features = L.featureGroup([departments, towns]);
}

EEDFMap.prototype.loadDepartments = function() {
  departments = new L.Shapefile("shp/departements-20180101-shp.zip", {
    style: this.styleDepartment
  });
}

EEDFMap.prototype.loadTowns = function() {
  towns = new L.Shapefile("shp/communes-20140629-100m-shp.zip", {
    filter: this.filterTowns,
    onEachFeature: this.onEachTown,
    style: this.styleTown
  });
}

EEDFMap.prototype.loadCountries = function() {
  countries = new L.Shapefile("shp/TM_WORLD_BORDERS-0.3.zip", {
    onEachFeature: this.onEachCountry,
    style: this.styleCountry
  });
}

EEDFMap.prototype.deactivateLoader = function() {
  map.once("data:loaded", function() {
    map.spin(false);
  });
}

EEDFMap.prototype.loadInfo = function() {
  info = L.control();
  info.onAdd = this.infoOnAdd;
  info.update = this.infoUpdate;
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
  features.resetStyle(e.target);
  info.update();
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
    className: "property-popup"
  }).setLatLng(layer.getBounds().getCenter())
    .setContent("<h4>" + centre["nom"] + "</h4>" 
      + "<p class='property-" + classNames[centre["type"]] + "'>" + (centre["type"] === "CENTRE" ? "Centre bénévole" : "CPN") + "</p>"
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