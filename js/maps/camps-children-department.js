function CampsChildrenDepartmentMap() { 
  EEDFMap.call(this);
}

CampsChildrenDepartmentMap.prototype = Object.create(EEDFMap.prototype, {
  constructor: { value: CampsChildrenDepartmentMap }
});

CampsChildrenDepartmentMap.prototype.loadFeatures = function() {
  // load departments data
  this.loadDepartments();
  // add features
  features = departments;
}

CampsChildrenDepartmentMap.prototype.loadDepartments = function() {
  departments = new L.Shapefile("http://osm13.openstreetmap.fr/~cquest/openfla/export/departements-20180101-shp.zip", {
    onEachFeature: this.onEachDepartment,
    style: this.styleDepartment
  });
}

CampsChildrenDepartmentMap.prototype.onEachDepartment = function(department, layer) {
  // find number of camps and children in department
  var departmentCampsAndChildren = campsChildrenDepartment.find(function(element) { return element["code_insee"] === department.properties["code_insee"]; });
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
    mouseover: CampsChildrenDepartmentMap.prototype.highlightFeature,
    mouseout: CampsChildrenDepartmentMap.prototype.resetFeature
  });
}

CampsChildrenDepartmentMap.prototype.styleDepartment = function(department) {
  // find number of children in department
  var departmentCampsAndChildren = campsChildrenDepartment.find(function(element) { return element["code_insee"] === department.properties["code_insee"]; });
  var minNumber = Math.min.apply(Math, campsChildrenDepartment.map(function(element) { return element["enfants"]; }));
  var maxNumber = Math.max.apply(Math, campsChildrenDepartment.map(function(element) { return element["enfants"]; }));
  // create a gradient fill
  var rainbow = new Rainbow()
    .setSpectrum("#FFF0BC", "#C72C48")
    .setNumberRange(7, 240);
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
      fillOpacity: 0.25
    }; 
  }
  // at least one camp
  return {
    color: "#" + rainbow.colourAt(departmentCampsAndChildren["enfants"]), 
    weight: 2, 
    fillOpacity: 0.85
  };
}

CampsChildrenDepartmentMap.prototype.highlightFeature = function(e) {
  var layer = e.target;
  // increase opacity to max
  layer.setStyle({
    fillOpacity: 1
  });
  CampsChildrenDepartmentMap.prototype.infoUpdate(layer.feature.properties);
}

CampsChildrenDepartmentMap.prototype.infoUpdate = function(properties) {
  // set title and department information (or legend by default)
  info._div.innerHTML = "<h4 class='title'>" + titles["CampsChildrenDepartmentMap"] + "</h4>"
    + (properties ? properties["code_insee"] + " " + properties["nom"] : "<i class='fas fa-campground'></i> Camps    <i class='fas fa-child'></i> Enfants")
    + "<br/><br/>"
    + "Enfants <span class='legend'></span>";
}
