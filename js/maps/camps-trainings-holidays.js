function CampsTrainingsHolidaysMap() { 
  EEDFMap.call(this);
}

CampsTrainingsHolidaysMap.prototype = Object.create(EEDFMap.prototype, {
  constructor: { value: CampsTrainingsHolidaysMap }
});

var departments;

CampsTrainingsHolidaysMap.prototype.loadFeatures = function() {
  // load towns data
  features[viewId] = new L.Shapefile("http://osm13.openstreetmap.fr/~cquest/openfla/export/communes-20150101-100m-shp.zip", {
    filter: this.filterTowns,
    onEachFeature: this.onEachTown,
    style: this.styleTown
  });
}

CampsTrainingsHolidaysMap.prototype.filterTowns = function(town) {
  // show town only if there is some data
  return !!campsTrainingsHolidays.find(function(element) { 
    return element["code_insee"] === town.properties["insee"] 
      && (element["camps"] !== "0"
        || element["bafa"] !== "0" 
        || element["bafd"] !== "0"
        || element["sejours"] !== "0");
    });
}

CampsTrainingsHolidaysMap.prototype.onEachTown = function(town, layer) {
  // display centre
  displayCentre(town, layer);
  // find camps, trainings and holidays in town
  var townCampsTrainingsHolidays = campsTrainingsHolidays.find(function(element) { return element["code_insee"] === town.properties["insee"]; });
  if (townCampsTrainingsHolidays 
    && (townCampsTrainingsHolidays["camps"] !== "0"
      || townCampsTrainingsHolidays["bafa"] !== "0"
      || townCampsTrainingsHolidays["bafd"] !== "0"
      || townCampsTrainingsHolidays["sejours"] !== "0")) {
    // custom direction
    var direction = "right";
    if (town.properties["insee"] === "63463") direction = "left";
    else if (town.properties["insee"] === "65078") direction = "left";
    else if (town.properties["insee"] === "73306") direction = "left";
    else if (town.properties["insee"] === "86024") direction = "left";
    // display camps, trainings and holidays in a tooltip
    layer.bindTooltip("<div class='camps-trainings-holidays-tooltip-1'><i class='fa fa-campground'></i> " + townCampsTrainingsHolidays["camps"] + "</div>"
        + "<div class='camps-trainings-holidays-tooltip-2'> " + townCampsTrainingsHolidays["bafa"] + " </div>"
        + "<div class='camps-trainings-holidays-tooltip-3'> " + townCampsTrainingsHolidays["bafd"] + " </div>"
        + "<div class='camps-trainings-holidays-tooltip-4'><i class='fa fa-sun'></i> " + townCampsTrainingsHolidays["sejours"] + "</div>", {
      permanent: true,
      direction: direction
    });
  }
}

CampsTrainingsHolidaysMap.prototype.styleTown = function(town) {
  return {
    stroke: false,
    fill: false
  };
}

CampsTrainingsHolidaysMap.prototype.infoUpdate = function(properties) {
  // set title and department information (or legend by default)
  infos[viewId]._div.innerHTML = "<h4 class='title'>" + titles["CampsTrainingsHolidaysMap"] + "</h4>"
  + "<i class='fa fa-campground'></i> Camps  |  "
  + "<span class='bafa'>BAFA</span>  |  "
  + "<span class='bafd'>BAFD</span>  |  "
  + "<i class='fa fa-sun'></i> Séjours";
}
