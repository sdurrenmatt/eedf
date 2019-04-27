function InternationalCampsMap() {
  EEDFMap.call(this);
}

InternationalCampsMap.prototype = Object.create(EEDFMap.prototype, {
  constructor: { value: InternationalCampsMap }
});

InternationalCampsMap.prototype.loadFeatures = function() {
  // load countries data
  this.loadCountries();
  // add features
  features = countries;
}

InternationalCampsMap.prototype.onEachCountry = function(country, layer) {
  // find camps in country
  var countryCamps = internationalCamps.find(function(camp) { return camp["pays"] === country.properties["ISO2"]; });
  if (countryCamps && countryCamps["camps"] !== "0") {
    // add marker
    L.marker([country.properties["LAT"], country.properties["LON"]], {
      icon: L.divIcon({
        className: "totals-tooltip",
        iconSize: [100, 30],
        html: "<i class='fas fa-campground'></i> " + countryCamps["camps"] + "<br><i class='fas fa-child'></i> " + countryCamps["enfants"]
      }),
      interactive: false
    }).addTo(map);
  }
  // add listeners on layer
  layer.on({
    mouseover: InternationalCampsMap.prototype.highlightFeature,
    mouseout: InternationalCampsMap.prototype.resetFeature
  });
}

InternationalCampsMap.prototype.styleCountry = function(country) {
  // find camps in country
  var countryCamps = internationalCamps.find(function(camp) { return camp["pays"] === country.properties["ISO2"]; });
  if (!countryCamps) {
    // no data
    return {
      color: "#AFAFAF", 
      weight: 1, 
      fillOpacity: 0.25
    }; 
  }
  if (countryCamps["camps"] === "0") {
    // zero camp
    return {
      color: "#AFAFAF", 
      weight: 2, 
      fillOpacity: 0.25
    }; 
  }
  // at least one camp
  return {
    color: "#72B026",
    weight: 2, 
    fillOpacity: 0.25
  };
}

InternationalCampsMap.prototype.highlightFeature = function(e) {
  var layer = e.target;
  // increase opacity to max
  layer.setStyle({
    fillOpacity: 0.5
  });
  InternationalCampsMap.prototype.infoUpdate(layer.feature.properties);
}

InternationalCampsMap.prototype.infoUpdate = function(properties) {
  info._div.innerHTML = "<h4 class='title'>" + titles["InternationalCampsMap"] + "</h4>"
    + (properties ? properties["NAME"] : "<i class='fas fa-campground'></i> Camps    <i class='fas fa-child'></i> Enfants");
}
