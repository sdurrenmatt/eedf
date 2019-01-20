function EEDFMap() {}

EEDFMap.prototype.init = function() {
  this.createLoader();
  this.addFeatures();
  this.deactivateLoader();
  this.addInfo();
}

EEDFMap.prototype.createLoader = function() {
  map.spin(true, spinConfig.options);
}

EEDFMap.prototype.addFeatures = function() {}

EEDFMap.prototype.deactivateLoader = function() {
  features.on("data:loaded", function() {
    map.spin(false);
  });
}

EEDFMap.prototype.addInfo = function() {
  info = L.control();
  info.onAdd = this.infoOnAdd;
  info.update = this.infoUpdate;
  info.addTo(map);
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
  info.update(layer.feature.properties);
}

EEDFMap.prototype.resetFeature = function(e) {
  features.resetStyle(e.target);
  info.update();
}
