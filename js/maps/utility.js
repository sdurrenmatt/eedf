function UtilityMap() { 
  EEDFMap.call(this);
}

UtilityMap.prototype = Object.create(EEDFMap.prototype, {
  constructor: { value: UtilityMap }
});

UtilityMap.prototype.filterTowns = function(town) {
  // show town only if there is some data
  return !!utility.find(function(element) { 
    return element["code_insee"] === town.properties["insee"];
    });
}

UtilityMap.prototype.onEachTown = function(town, layer) {
  // display centre
  UtilityMap.prototype.displayCentre(town, layer);
  // find camps, trainings and holidays in town
  var townUtility = utility.find(function(element) { return element["code_insee"] === town.properties["insee"]; });
  if (townUtility) {
    // custom direction
    var direction = "right";
    if      (town.properties["insee"] === "06116") direction = "bottom";
    else if (town.properties["insee"] === "13001") direction = "bottom";
    else if (town.properties["insee"] === "63463") direction = "left";
    else if (town.properties["insee"] === "65078") direction = "left";
    else if (town.properties["insee"] === "73306") direction = "left";
    else if (town.properties["insee"] === "81201") direction = "bottom";
    else if (town.properties["insee"] === "85166") direction = "left";
    else if (town.properties["insee"] === "86024") direction = "left";
    // display camps, trainings and holidays in a tooltip
    layer.bindTooltip("<div class='camps-trainings-holidays-tooltip-1'><i class='fa fa-campground'></i> " + townUtility["camps"] + "</div>"
        + "<div class='camps-trainings-holidays-tooltip-2'> " + townUtility["bafa"] + " </div>"
        + "<div class='camps-trainings-holidays-tooltip-3'> " + townUtility["bafd"] + " </div>"
        + "<div class='camps-trainings-holidays-tooltip-4'><i class='fa fa-sun'></i> " + townUtility["sejours"] + "</div>", {
      permanent: true,
      direction: direction
    });
  }
}

UtilityMap.prototype.styleTown = function(town) {
  return {
    stroke: false,
    fill: false
  };
}

UtilityMap.prototype.infoUpdate = function(properties) {
  // set title and department information (or legend by default)
  info._div.innerHTML = "<h4 class='title'>" + titles["UtilityMap"] + "</h4>"
    + "<i class='fa fa-campground'></i> Camps  |  "
    + "<span class='bafa'>BAFA</span>  |  "
    + "<span class='bafd'>BAFD</span>  |  "
    + "<i class='fa fa-sun'></i> Séjours";
}
