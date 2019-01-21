function CentresMap() { 
  EEDFMap.call(this); 
}

CentresMap.prototype = Object.create(EEDFMap.prototype, {
  constructor: { value: CentresMap }
});

var centres;

CentresMap.prototype.loadFeatures = function() {
  // load centres data
  centres = $.csv.toObjects(data.csv.centres);
  // load towns data
  features[viewId] = new L.Shapefile("http://osm13.openstreetmap.fr/~cquest/openfla/export/communes-20150101-100m-shp.zip", {
    filter: this.filterTowns,
    onEachFeature: this.onEachTown,
    style: this.styleTown
  });
}

CentresMap.prototype.filterTowns = function(town) {
  console.log(town);
  // show town only if there is a centre
  return !!centres.find(function(centre) { return centre["code_insee"] === town.properties["insee"]; });
}

CentresMap.prototype.onEachTown = function(town, layer) {
  // find centre in town
  var centre = centres.find(function(centre) { return centre["code_insee"] === town.properties["insee"]; });

  // create awesome marker
  var awesomeMarker = L.AwesomeMarkers.icon({
    icon: "home",
    prefix: "fa",
    markerColor: centre["type"] === "CENTRE" ? "green" : "black"
  });

  // create popup
  var popup = L.popup({
    className: "centre-popup"
  }).setContent("<h4>" + centre["nom"] + "</h4>" 
    + "<p class='centre-" + centre["type"] + "'>" + (centre["type"] === "CENTRE" ? "Centre bénévole" : "CPN") + "</p>"
    + "<p class='town'>" + centre["code_insee"] + " " + town.properties["nom"] + "</p>");

  // add marker
  L.marker(layer.getBounds().getCenter(), {
    icon: awesomeMarker
  }).bindPopup(popup)
    .addTo(map);
}

CentresMap.prototype.styleTown = function(town) {
  return {
    stroke: false,
    fill: false
  };
}

CentresMap.prototype.infoUpdate = function(properties) {
  // set title
  infos[viewId]._div.innerHTML = "<h4>" + titles["CentresMap"] + "</h4>";
}
