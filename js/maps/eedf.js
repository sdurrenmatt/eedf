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
  features[viewId].on("data:loaded", function() {
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

EEDFMap.prototype.highlightFeature = function(e) {
  var layer = e.target;
  infos[viewId].update(layer.feature.properties);
}

EEDFMap.prototype.resetFeature = function(e) {
  features[viewId].resetStyle(e.target);
  infos[viewId].update();
}
