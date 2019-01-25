function CampsAndChildrenMap() { 
  BafaMap.call(this);
}

CampsAndChildrenMap.prototype = Object.create(EEDFMap.prototype, {
  constructor: { value: CampsAndChildrenMap }
});

CampsAndChildrenMap.prototype.loadFeatures = function() {
  // load towns data
  features[viewId] = new L.Shapefile("http://osm13.openstreetmap.fr/~cquest/openfla/export/communes-20150101-100m-shp.zip", {
    filter: this.filterTowns,
    onEachFeature: this.onEachTown,
    style: this.styleTown
  });
}

CampsAndChildrenMap.prototype.filterTowns = function(town) {
  // show town only if there are camps
  return !!campsAndChildren.find(function(element) { return element["code_insee"] === town.properties["insee"] && element["camps"] !== "0";});
}

CampsAndChildrenMap.prototype.onEachTown = function(town, layer) {
  // display centre
  displayCentre(town, layer);
  // find number of camps and children in town
  var townCampsAndChildren = campsAndChildren.find(function(element) { return element["code_insee"] === town.properties["insee"]; });
  if (townCampsAndChildren && townCampsAndChildren["camps"] !== "0") {
    // display camps and children in a tooltip
    layer.bindTooltip("<div class='camps-tooltip'><i class='fas fa-campground'></i> " + townCampsAndChildren["camps"] + "</div><div class='children-tooltip'><i class='fas fa-child'></i> " + townCampsAndChildren["enfants"] + "</div>", {
      permanent: true,
      direction: "right",
      className: "campsAndChildren-tooltip"
    });
  }
}

CampsAndChildrenMap.prototype.styleTown = function(town) {
  return {
    stroke: false,
    fill: false
  };
}

CampsAndChildrenMap.prototype.infoUpdate = function(properties) {
  // set title and department information (or legend by default)
  infos[viewId]._div.innerHTML = "<h4 class='title'>" + titles["CampsAndChildrenMap"] + "</h4>"
  + (properties ? properties["code_insee"] + " " + properties["nom"] : "<i class='fas fa-campground'></i> Camps    <i class='fas fa-child'></i> Enfants");
}
