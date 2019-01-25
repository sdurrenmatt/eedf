function BafaMap() { 
  EEDFMap.call(this);
}

BafaMap.prototype = Object.create(EEDFMap.prototype, {
  constructor: { value: BafaMap }
});

var departments;

BafaMap.prototype.loadFeatures = function() {
  // load departments data
  departments = new L.Shapefile("http://osm13.openstreetmap.fr/~cquest/openfla/export/departements-20180101-shp.zip", {
    onEachFeature: this.onEachDepartment,
    style: this.styleDepartment
  });
  // load towns data
  var towns = new L.Shapefile("http://osm13.openstreetmap.fr/~cquest/openfla/export/communes-20150101-100m-shp.zip", {
    filter: this.filterTowns,
    onEachFeature: this.onEachTown,
    style: this.styleTown
  });
  features[viewId] = L.featureGroup([departments, towns]);
}

BafaMap.prototype.onEachDepartment = function(department, layer) {
  // find number of trainees in department
  var departmentTrainees = trainees.find(function(trainee) { return trainee["code_insee"] === department.properties["code_insee"]; });
  if (departmentTrainees && departmentTrainees["total"] !== "0") {
    // display total trainees in a tooltip
    layer.bindTooltip(departmentTrainees["total"], {
      permanent: true, 
      direction: "center",
      className: "totals-tooltip"
    });
  }
  // add listeners on layer
  layer.on({
    mouseover: BafaMap.prototype.highlightFeature,
    mouseout: BafaMap.prototype.resetFeature
  });
}

BafaMap.prototype.styleDepartment = function(department) {
  // find number of trainees in department
  var departmentTrainees = trainees.find(function(trainee) { return trainee["code_insee"] === department.properties["code_insee"]; });
  // create a gradient fill
  var rainbow = new Rainbow()
    .setSpectrum("#FFF0BC", "#C72C48")
    .setNumberRange(0, 100);
  if (!departmentTrainees) {
    // no data
    return {
      color: "#AFAFAF", 
      weight: 1, 
      fillOpacity: 0.25
    }; 
  }
  if (departmentTrainees["total"] === "0") {
    // zero trainee
    return {
      color: "#AFAFAF", 
      weight: 2, 
      fillOpacity: 0.5
    }; 
  }
  // at least one trainee
  return {
    color: "#" + rainbow.colourAt(departmentTrainees["total"]), 
    weight: 2, 
    fillOpacity: 0.85
  };
}

BafaMap.prototype.filterTowns = function(town) {
  // show town only if there are trainings
  return !!trainings.find(function(training) { return training["code_insee"] === town.properties["insee"] && (training["bafa"] !== "0" || training["bafd"] !== "0");});
}

BafaMap.prototype.onEachTown = function(town, layer) {
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
  // find number of trainings in town
  var townTrainings = trainings.find(function(training) { return training["code_insee"] === town.properties["insee"]; });
  if (townTrainings && (townTrainings["bafa"] !== "0" || townTrainings["bafd"] !== "0")) {
    // display bafa and bafd trainings in a tooltip
    layer.bindTooltip("<div class='bafa-tooltip'>" + townTrainings["bafa"] + "</div><div class='bafd-tooltip'>" + townTrainings["bafd"] + "</div>", {
      permanent: true,
      direction: "right",
      className: "trainings-tooltip"
    });
  }
}

BafaMap.prototype.styleTown = function(town) {
  return {
    stroke: false,
    fill: false
  };
}

BafaMap.prototype.highlightFeature = function(e) {
  var layer = e.target;
  // increase opacity to max
  layer.setStyle({
    fillOpacity: 1
  });
  BafaMap.prototype.infoUpdate(layer.feature.properties);
}

BafaMap.prototype.resetFeature = function(e) {
  departments.resetStyle(e.target);
  BafaMap.prototype.infoUpdate();
}

BafaMap.prototype.infoUpdate = function(properties) {
  // set title and department information (or legend by default)
  infos[viewId]._div.innerHTML = "<h4 class='title'>" + titles["BafaMap"] + "</h4>"
  + (properties ? properties["code_insee"] + " " + properties["nom"] : "<span class='bafa'>BAFA</span>  |  <span class='bafd'>BAFD</span>")
  + "<br/><br/>"
  + "Stagiaires par département <span class='trainees-legend'></span>";
}
