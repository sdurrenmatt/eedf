function MinorHolidaysMap() { 
  BafaMap.call(this);
}

MinorHolidaysMap.prototype = Object.create(EEDFMap.prototype, {
  constructor: { value: MinorHolidaysMap }
});

MinorHolidaysMap.prototype.loadDepartments = function() {
  departments = new L.Shapefile("shp/departements-20180101-shp.zip", {
    onEachFeature: this.onEachDepartment,
    style: this.styleDepartment
  });
}

MinorHolidaysMap.prototype.onEachDepartment = function(department, layer) {
  // find number of vacationers in department
  var departmentVacationers = minorVacationers.find(function(vacationer) { return vacationer["code_insee"] === department.properties["code_insee"]; });
  if (departmentVacationers && departmentVacationers["total"] !== "0") {
    // display total vacationers in a tooltip
    layer.bindTooltip(departmentVacationers["total"], {
      permanent: true, 
      direction: "center",
      className: "totals-tooltip"
    });
  }
  // add listeners on layer
  layer.on({
    mouseover: MinorHolidaysMap.prototype.highlightFeature,
    mouseout: MinorHolidaysMap.prototype.resetFeature
  });
}

MinorHolidaysMap.prototype.styleDepartment = function(department) {
  // find number of minor vacationers in department
  var departmentVacationers = minorVacationers.find(function(vacationer) { return vacationer["code_insee"] === department.properties["code_insee"]; });
  // create a gradient fill
  var rainbow = new Rainbow()
    .setSpectrum("#FFF0BC", "#C72C48")
    .setNumberRange(16, 85);
  if (!departmentVacationers) {
    // no data
    return {
      color: "#AFAFAF", 
      weight: 1, 
      fillOpacity: 0.25
    }; 
  }
  if (departmentVacationers["total"] === "0") {
    // zero camp
    return {
      color: "#AFAFAF", 
      weight: 2, 
      fillOpacity: 0.5
    }; 
  }
  // at least one camp
  return {
    color: "#" + rainbow.colourAt(departmentVacationers["total"]), 
    weight: 2, 
    fillOpacity: 0.85
  };
}

MinorHolidaysMap.prototype.filterTowns = function(town) {
  // show town only if there are stays
  return !!minorHolidays.find(function(holiday) { return holiday["code_insee"] === town.properties["insee"] && holiday["sejours"] !== "0";});
}

MinorHolidaysMap.prototype.onEachTown = function(town, layer) {
  // display centre
  MinorHolidaysMap.prototype.displayCentre(town, layer);
  // find number of minor holidays in town
  var townHolidays = minorHolidays.find(function(holiday) { return holiday["code_insee"] === town.properties["insee"]; });
  if (townHolidays) {
    // custom direction
    var direction = "right";
    if (town.properties["insee"] === "73306") direction = "left";
    // display stays and vacationers in a tooltip
    layer.bindTooltip("<div class='stays-tooltip'><i class='fas fa-sun'></i> " + townHolidays["sejours"] + "</div>"
        + "<div class='vacationers-tooltip'><i class='fas fa-male'></i> " + townHolidays["vacanciers"] + "</div>", {
      permanent: true,
      direction: direction
    });
  }
}

MinorHolidaysMap.prototype.styleTown = function(town) {
  return {
    stroke: false,
    fill: false
  };
}

MinorHolidaysMap.prototype.highlightFeature = function(e) {
  var layer = e.target;
  // increase opacity to max
  layer.setStyle({
    fillOpacity: 1
  });
  MinorHolidaysMap.prototype.infoUpdate(layer.feature.properties);
}

MinorHolidaysMap.prototype.resetFeature = function(e) {
  departments.resetStyle(e.target);
  MinorHolidaysMap.prototype.infoUpdate();
}

MinorHolidaysMap.prototype.infoUpdate = function(properties) {
  // set title and department information (or legend by default)
  info._div.innerHTML = "<h4 class='title'>" + titles["MinorHolidaysMap"] + "</h4>"
    + (properties ? properties["code_insee"] + " " + properties["nom"] : "<i class='fas fa-sun'></i> Séjours    <i class='fas fa-male'></i> Vacanciers")
    + "<br/><br/>"
    + "Vacanciers par département <span class='legend'></span>";
}
