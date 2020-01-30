// Loading map using center coordinates 
var mymap = L.map("map", {
    center: [0, -20],
    zoom: 2
  });

// Accessing mapbox and adding to mymap
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v10',
    accessToken: API_KEY
}).addTo(mymap);

// Defining URL for geojson
var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(URL, d =>{
    d.features.forEach(m =>{
        var color = "";
        if(m.properties.mag > 5){
            color = "#0D4484";
        } else if(m.properties.mag > 4){
            color = "#2896D2";
        } else if(m.properties.mag > 3){
            color = "#47C6D1";
        } else if(m.properties.mag > 2){
            color = "#47D188";
        } else if(m.properties.mag > 1){
            color = "#9CF080";
        } else {
            color= "#EDF25C";
        };
        L.circle([m.geometry.coordinates[1],m.geometry.coordinates[0]],{
            fillOpacity: 1,
            color: color,
            fillColor: color,
            radius : m.properties.mag * 50000
        }).bindPopup("<h2>" + m.properties.title + "</h2> <hr> <h3>" + m.properties.type + "</h3>").addTo(mymap);
    })
});

// Function to get same colors for the intervals
function intervalColor(d) {
    return d > 5 ? '#0D4484':
           d > 4 ? '#2896D2':
           d > 3 ? '#47C6D1':
           d > 2 ? '#47D188':
           d > 1 ? '#9CF080':
           d > 0 ? '#EDF25C':
            '#EFE38F';
    };
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (mymap) {

    var div = L.DomUtil.create('div', 'info legend'),
        intervals = ["0", "1", "2", "3", "4", "5"];

    // Generatings intervals for bottom right corner
    for (var i = 0; i < intervals.length; i++) {
        div.innerHTML +=
            '<i style="background:' + intervalColor(intervals[i]) + '"></i> ' +
            intervals[i] + (intervals[i + 1] ? '&ndash;' + intervals[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(mymap);