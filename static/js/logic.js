// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create a map object
let myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 2
});

// Create the base layer (street map)
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Perform a GET request to the query URL and create the map
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Define a function to set the color based on depth.
  function getColor(depth) {
    if (depth > 90) {
      return "#644D8E";
    } else if (depth > 70) {
      return "#8E5B91";
    } else if (depth > 50) {
      return "#C76B8F";
    } else if (depth > 30) {
      return "#DC828E";
    } else if (depth > 10) {
      return "#EC988E";
    } else {
      return "#FFCC99";
    }
  }

  // Create a GeoJSON layer and set the style based on depth.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    },
    pointToLayer: function (feature, latlng) {
      let depth = feature.geometry.coordinates[2];
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * 3.5,
        fillColor: getColor(depth), // Use the getColor function to set the fill color
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
      });
    }
  }).addTo(myMap);

// Set up the legend.
let legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "legend");
  let depths = [-10, 10, 30, 50, 70, 90];
  let lcolor = ["#FFCC99", "#EC988E", "#DC828E", "#C76B8F", "#8E5B91", "#644D8E"]
  let labels = [];
  // Add the legend items
  for (let i = 0; i < depths.length; i++) {
      div.innerHTML+= '<i style="background:' + lcolor[i] + '"></i> ' + // Use <i> for legend color
          depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+'
      );
  }
  return div;
};
  // Adding the legend to the map
  legend.addTo(myMap);
}
