function EEDFMap() {}

EEDFMap.prototype.load = function() {
  this.createLoader();
  this.loadFeatures();
  this.loadInfo();
  this.deactivateLoader();
}

EEDFMap.prototype.createLoader = function() {
  map.spin(true, spinConfig.options);
}

EEDFMap.prototype.loadFeatures = function() {}

EEDFMap.prototype.deactivateLoader = function() {
  departments.on("dataLoadComplete", function() {
    map.spin(false);
  });
}

EEDFMap.prototype.loadInfo = function() {
  infos[viewId] = L.control();
  infos[viewId].onAdd = this.infoOnAdd;
  infos[viewId].update = this.infoUpdate;
}

EEDFMap.prototype.infoOnAdd = function(map) {
  this._div = L.DomUtil.create("div", "info");
  this.update();
  return this._div;
};

EEDFMap.prototype.infoUpdate = function(properties) {
  this._div.innerHTML = "";
}

EEDFMap.prototype.resetFeature = function(e) {
  features[viewId].resetStyle(e.target);
  infos[viewId].update();
}

EEDFMap.prototype.styleDepartment = function() {
  return {
    color: "#AFAFAF",
    weight: 1,
    fillOpacity: 0.25
  };
}
