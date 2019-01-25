function CampsAndChildren2Map() { 
  EEDFMap.call(this);
}

CampsAndChildren2Map.prototype = Object.create(EEDFMap.prototype, {
  constructor: { value: CampsAndChildren2Map }
});

CampsAndChildren2Map.prototype.loadFeatures = function() {
  // load departments data
  features[viewId] = new L.Shapefile("http://osm13.openstreetmap.fr/~cquest/openfla/export/departements-20180101-shp.zip", {
    onEachFeature: this.onEachDepartment,
    style: this.styleDepartment
  });
}

CampsAndChildren2Map.prototype.onEachDepartment = function(department, layer) {
  // find number of camps and children in department
  var departmentCampsAndChildren = campsAndChildren2.find(function(element) { return element["code_insee"] === department.properties["code_insee"]; });
  if (departmentCampsAndChildren && departmentCampsAndChildren["camps"] !== "0") {
    // display camps and children in a tooltip
    layer.bindTooltip("<i class='fas fa-campground'></i> " + departmentCampsAndChildren["camps"] + "<br><i class='fas fa-child'></i> " + departmentCampsAndChildren["enfants"], {
      permanent: true, 
      direction: "center",
      className: "totals-tooltip"
    });
  }
  // add listeners on layer
  layer.on({
    mouseover: CampsAndChildren2Map.prototype.highlightFeature,
    mouseout: CampsAndChildren2Map.prototype.resetFeature
  });
}

CampsAndChildren2Map.prototype.styleDepartment = function(department) {
  // find number of children in department
  var departmentCampsAndChildren = campsAndChildren2.find(function(element) { return element["code_insee"] === department.properties["code_insee"]; });
  var minNumber = Math.min.apply(Math, campsAndChildren2.map(function(element) { return element["enfants"]; }));
  var maxNumber = Math.max.apply(Math, campsAndChildren2.map(function(element) { return element["enfants"]; }));
  // create a gradient fill
  var rainbow = new Rainbow()
    .setSpectrum("#FFF0BC", "#C72C48")
    .setNumberRange(minNumber, maxNumber);
  if (!departmentCampsAndChildren) {
    // no data
    return {
      color: "#AFAFAF", 
      weight: 1, 
      fillOpacity: 0.25
    }; 
  }
  if (departmentCampsAndChildren["enfants"] === "0") {
    // zero camp
    return {
      color: "#AFAFAF", 
      weight: 2, 
      fillOpacity: 0.5
    }; 
  }
  // at least one camp
  return {
    color: "#" + rainbow.colourAt(departmentCampsAndChildren["enfants"]), 
    weight: 2, 
    fillOpacity: 0.85
  };
}

CampsAndChildren2Map.prototype.highlightFeature = function(e) {
  var layer = e.target;
  // increase opacity to max
  layer.setStyle({
    fillOpacity: 1
  });
  CampsAndChildren2Map.prototype.infoUpdate(layer.feature.properties);
}

CampsAndChildren2Map.prototype.infoUpdate = function(properties) {
  // set title and department information (or legend by default)
  infos[viewId]._div.innerHTML = "<h4 class='title'>" + titles["CampsAndChildren2Map"] + "</h4>"
    + (properties ? properties["code_insee"] + " " + properties["nom"] : "<i class='fas fa-campground'></i> Camps    <i class='fas fa-child'></i> Enfants")
    + "<br/><br/>"
    + "Enfants <span class='legend'></span>";;
}
