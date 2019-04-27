function InternationalHolidayMap() {
  EEDFMap.call(this);
}

InternationalHolidayMap.prototype = Object.create(EEDFMap.prototype, {
  constructor: { value: InternationalHolidayMap }
});

InternationalHolidayMap.prototype.loadFeatures = function() {
  // load countries data
  this.loadCountries();
  // add features
  features = countries;
}

InternationalHolidayMap.prototype.onEachCountry = function(country, layer) {
  // find holiday in country
  var countryHoliday = internationalHoliday.find(function(holiday) { return holiday["pays"] === country.properties["ISO2"]; });
  if (countryHoliday && countryHoliday["sejours"] !== "0") {
    // add marker
    L.marker([country.properties["LAT"], country.properties["LON"]], {
      icon: L.divIcon({
        className: "totals-tooltip",
        iconSize: [100, 30],
        html: "<i class='fas fa-sun'></i> " + countryHoliday["sejours"] + "<br><i class='fas fa-wheelchair'></i> " + countryHoliday["adultes_handicapes"]
      }),
      interactive: false
    }).addTo(map);
  }
  // add listeners on layer
  layer.on({
    mouseover: InternationalHolidayMap.prototype.highlightFeature,
    mouseout: InternationalHolidayMap.prototype.resetFeature
  });
}

InternationalHolidayMap.prototype.styleCountry = function(country) {
  // find camps in country
  var countryHoliday = internationalHoliday.find(function(holiday) { return holiday["pays"] === country.properties["ISO2"]; });
  if (!countryHoliday) {
    // no data
    return {
      color: "#AFAFAF", 
      weight: 1, 
      fillOpacity: 0.25
    }; 
  }
  if (countryHoliday["sejours"] === "0") {
    // zero holiday
    return {
      color: "#AFAFAF", 
      weight: 2, 
      fillOpacity: 0.25
    }; 
  }
  // at least one holiday
  return {
    color: "#72B026",
    weight: 2, 
    fillOpacity: 0.25
  };
}

InternationalHolidayMap.prototype.highlightFeature = function(e) {
  var layer = e.target;
  // increase opacity to max
  layer.setStyle({
    fillOpacity: 0.5
  });
  InternationalHolidayMap.prototype.infoUpdate(layer.feature.properties);
}

InternationalHolidayMap.prototype.infoUpdate = function(properties) {
  info._div.innerHTML = "<h4 class='title'>" + titles["InternationalHolidayMap"] + "</h4>"
    + (properties ? properties["NAME"] : "<i class='fas fa-sun'></i> Séjours    <i class='fas fa-wheelchair'></i> Adultes handicapés");
}
