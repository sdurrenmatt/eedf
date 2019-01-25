function HolidayMap() { 
  BafaMap.call(this);
}

HolidayMap.prototype = Object.create(EEDFMap.prototype, {
  constructor: { value: HolidayMap }
});

HolidayMap.prototype.loadFeatures = function() {
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

HolidayMap.prototype.onEachDepartment = function(department, layer) {
  // find number of vacationers in department
  var departmentVacationers = vacationers.find(function(vacationer) { return vacationer["code_insee"] === department.properties["code_insee"]; });
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
    mouseover: HolidayMap.prototype.highlightFeature,
    mouseout: HolidayMap.prototype.resetFeature
  });
}

HolidayMap.prototype.styleDepartment = function(department) {
  // find number of vacationers in department
  var departmentVacationers = vacationers.find(function(vacationer) { return vacationer["code_insee"] === department.properties["code_insee"]; });
  var minNumber = Math.min.apply(Math, vacationers.map(function(vacationer) { return vacationer["total"]; }));
  var maxNumber = Math.max.apply(Math, vacationers.map(function(vacationer) { return vacationer["total"]; }));
  // create a gradient fill
  var rainbow = new Rainbow()
    .setSpectrum("#FFF0BC", "#C72C48")
    .setNumberRange(minNumber, maxNumber);
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

HolidayMap.prototype.filterTowns = function(town) {
  // show town only if there are stays
  return !!holidays.find(function(holiday) { return holiday["code_insee"] === town.properties["insee"] && holiday["sejours"] !== "0";});
}

HolidayMap.prototype.onEachTown = function(town, layer) {
  // display centre
  displayCentre(town, layer);
  // find number of holidays in town
  var townHolidays = holidays.find(function(holiday) { return holiday["code_insee"] === town.properties["insee"]; });
  if (townHolidays && townHolidays["sejours"] !== "0") {
    // custom direction
    var direction = "right";
    if (town.properties["insee"] === "05079") direction = "left";
    // display stays and vacationers in a tooltip
    layer.bindTooltip("<div class='stays-tooltip'><i class='fas fa-sun'></i> " + townHolidays["sejours"] + "</div><div class='vacationers-tooltip'><i class='fas fa-male'></i> " + townHolidays["vacanciers"] + "</div>", {
      permanent: true,
      direction: direction,
      className: "holidays-tooltip"
    });
  }
}

HolidayMap.prototype.styleTown = function(town) {
  return {
    stroke: false,
    fill: false
  };
}

HolidayMap.prototype.highlightFeature = function(e) {
  var layer = e.target;
  // increase opacity to max
  layer.setStyle({
    fillOpacity: 1
  });
  HolidayMap.prototype.infoUpdate(layer.feature.properties);
}

HolidayMap.prototype.resetFeature = function(e) {
  departments.resetStyle(e.target);
  HolidayMap.prototype.infoUpdate();
}

HolidayMap.prototype.infoUpdate = function(properties) {
  // set title and department information (or legend by default)
  infos[viewId]._div.innerHTML = "<h4 class='title'>" + titles["HolidayMap"] + "</h4>"
  + (properties ? properties["code_insee"] + " " + properties["nom"] : "<i class='fas fa-sun'></i> Séjours    <i class='fas fa-male'></i> Vacanciers")
  + "<br/><br/>"
  + "Vacanciers par département <span class='legend'></span>";
}
