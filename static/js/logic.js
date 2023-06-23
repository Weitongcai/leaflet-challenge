//Initial Map

let myMap = L.map("map", {
    center: [
    37.7829, -105.2534
    ],
    zoom: 5,
});

//Add tile layer to map
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Store our API endpoint as queryUrl.
let queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL/
d3.json(queryURL).then(function (data) {
    function mapStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            weight: 1,
            fillColor: circleColor(feature.geometry.coordinates[2]),
            color: "black",
            radius: circleRadius(feature.properties.mag),


        }
    };
    // Set the colors for each earthquake range from red to green
    function circleColor(depth) {
        switch(true) {
            case depth > 90:
                return "#FF3500";
            case depth > 70:
                return "#FF6500";
            case depth > 50:
                return "#FFA500";
            case depth > 30:
                return "#FFFF00";
            case depth > 10:
                return "#90EE90";
            default:
                return "#ADFF2F";
        }
    };
    //Return the radius of the earthquakes multipled by 4
    function circleRadius(mag){
        return mag * 4;
    };

        // Adding the data to the map
        L.geoJson(data, {

        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },

        style: mapStyle,

        // Popups that provide addtional info 
        onEachFeature: function(feature, layer) {
            layer.bindPopup( "Title:" + feature.properties.title + "<br>Depth: " + feature.geometry.coordinates[2] + "<br>Magnitude:" + feature.properties.mag + "<br>Location:" + feature.properties.place);

        }
    }).addTo(myMap);


    //Add Legend showing the depth and their corresponding color
    let legend = L.control({ position: "bottomright"});

    legend.onAdd = function (map) {
    let div = L.DomUtil.create("div", "info legend");
    let depths = [-10, 10, 30, 50, 70, 90];
    let labels = [];
    
      // loop through the depth ranges and generate the legend HTML
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
        '<i style="background:' +
        circleColor(depths[i] + 1) +
        '"></i> ' +
        depths[i] +
        (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
    }
    
    return div;
    };
    
    legend.addTo(myMap);

// set background as white for the legend container
let legendContainer = document.querySelector(".legend");
legendContainer.style.backgroundColor = "rgba(255, 255, 255, 0.8)";

});