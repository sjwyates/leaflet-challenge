const geoJsonQueryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"

const theMap = L.map("map-target", {
    center: [
      40, -105
    ],
    zoom: 5,
    layers
});

const earthQuakeLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(theMap);


d3.json(geoJsonQueryURL, (res) => {
    const quakes = res.features.map(quake => {
        return {
            magnitude: quake.properties.mag,
            latlng: quake.coordinates.slice(0,2).reverse(),
            depth: quake.coordinates[2]
        }
    })

})
