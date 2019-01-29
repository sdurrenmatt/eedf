function CampsChildrenCentreMap() { 
  BafaMap.call(this);
}

CampsChildrenCentreMap.prototype = Object.create(EEDFMap.prototype, {
  constructor: { value: CampsChildrenCentreMap }
});

CampsChildrenCentreMap.prototype.filterTowns = function(town) {
  // show town only if there are camps
  return !!campsChildrenCentre.find(function(element) { return element["code_insee"] === town.properties["insee"] && element["camps"] !== "0";});
}

CampsChildrenCentreMap.prototype.onEachTown = function(town, layer) {
  // display centre
  CampsChildrenCentreMap.prototype.displayCentre(town, layer);
  // find number of camps and children in town
  var townCampsAndChildren = campsChildrenCentre.find(function(element) { return element["code_insee"] === town.properties["insee"]; });
  if (townCampsAndChildren && townCampsAndChildren["camps"] !== "0") {
    // custom direction
    var direction = "right";
    if      (town.properties["insee"] === "65017") direction = "left";
    else if (town.properties["insee"] === "81201") direction = "left";
    // display camps and children in a tooltip
    layer.bindTooltip("<div class='camps-tooltip'><i class='fas fa-campground'></i> " + townCampsAndChildren["camps"] + "</div><div class='children-tooltip'><i class='fas fa-child'></i> " + townCampsAndChildren["enfants"] + "</div>", {
      permanent: true,
      direction: direction
    });
  }
}

CampsChildrenCentreMap.prototype.styleTown = function(town) {
  return {
    stroke: false,
    fill: false
  };
}

CampsChildrenCentreMap.prototype.infoUpdate = function(properties) {
  // set title and department information (or legend by default)
  infos[viewId]._div.innerHTML = "<h4 class='title'>" + titles["CampsChildrenCentreMap"] + "</h4>"
    + (properties ? properties["code_insee"] + " " + properties["nom"] : "<i class='fas fa-campground'></i> Camps    <i class='fas fa-child'></i> Enfants");
}
