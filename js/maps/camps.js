function CampsMap() { 
  EEDFMap.call(this);
}

CampsMap.prototype = Object.create(EEDFMap.prototype, {
  constructor: { value: CampsMap }
});

CampsMap.prototype.loadFeatures = function() {
  // load departments data
  features[viewId] = new L.Shapefile("http://osm13.openstreetmap.fr/~cquest/openfla/export/departements-20180101-shp.zip", {
    onEachFeature: this.onEachDepartment,
    style: this.styleDepartment
  });
}

CampsMap.prototype.onEachDepartment = function(department, layer) {
  // find number of camps in department
  var departmentCamps = camps.find(function(camp) { return camp["code_insee"] === department.properties["code_insee"]; });
  if (departmentCamps && departmentCamps["total"] !== "0") {
    // display eedf and total camps in a tooltip
    layer.bindTooltip("☘ " + departmentCamps["eedf"] + "  |  " + departmentCamps["total"], {
      permanent: true, 
      direction: "center",
      className: "totals-tooltip"
    });
  }
  // add listeners on layer
  layer.on({
    mouseover: CampsMap.prototype.highlightFeature,
    mouseout: CampsMap.prototype.resetFeature
  });
}

CampsMap.prototype.styleDepartment = function(department) {
  // find number of camps in department
  var departmentCamps = camps.find(function(camp) { return camp["code_insee"] === department.properties["code_insee"]; });
  var minNumber = Math.min.apply(Math, camps.map(function(camp) { return camp["total"]; }));
  var maxNumber = Math.max.apply(Math, camps.map(function(camp) { return camp["total"]; }));
  // create a gradient fill
  var rainbow = new Rainbow()
    .setSpectrum("#FFF0BC", "#C72C48")
    .setNumberRange(minNumber, maxNumber);
  if (!departmentCamps) {
    // no data
    return {
      color: "#AFAFAF", 
      weight: 1, 
      fillOpacity: 0.25
    }; 
  }
  if (departmentCamps["total"] === "0") {
    // zero camp
    return {
      color: "#AFAFAF", 
      weight: 2, 
      fillOpacity: 0.5
    }; 
  }
  // at least one camp
  return {
    color: "#" + rainbow.colourAt(departmentCamps["total"]), 
    weight: 2, 
    fillOpacity: 0.85
  };
}

CampsMap.prototype.highlightFeature = function(e) {
  var layer = e.target;
  // increase opacity to max
  layer.setStyle({
    fillOpacity: 1
  });
  CampsMap.prototype.infoUpdate(layer.feature.properties);
}

CampsMap.prototype.infoUpdate = function(properties) {
  // set title and department information (or legend by default)
  infos[viewId]._div.innerHTML = "<h4 class='title'>" + titles["CampsMap"] + "</h4>"
    + (properties ? properties["code_insee"] + " " + properties["nom"] : "☘ EEDF  |  Total");
}
