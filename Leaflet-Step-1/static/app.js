const geoJsonQueryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"

d3.json(geoJsonQueryURL, (res) => {
    const quakes = res.features.map(quake => {
        return {
            magnitude: quake.properties.mag,
            latlng: quake.geometry.coordinates.slice(0, 2).reverse(),
            depth: quake.geometry.coordinates[2]
        }
    })
    createMap(quakes);
})


function createMap(quakes) {

    const maxDepth = d3.max(quakes, q => q.depth);
    const quakeCircles = quakes.map(quake => {
        const fillColor = d3.interpolateRdYlGn(quake.depth / maxDepth)
        const markerSize = quake.magnitude * 23456;
        const quakeCircle = L.circle(quake.latlng, {
            color: fillColor,
            fillOpacity: 0.75,
            fillcolor: fillColor,
            radius: markerSize
        })
            .bindPopup(`<p>Magnitude: ${quake.magnitude}</p><hr><p>Depth: ${quake.depth}</p>`);
        return quakeCircle;
    });
    const quakeLayer = L.layerGroup(quakeCircles);

    const satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });

    const baseMaps = {
        "Satellite": satelliteMap,
    }

    const overlayMaps = {
        "Earthquakes": quakeLayer,
    }

    const theMap = L.map("map-target", {
        center: [40, -105],
        zoom: 5,
        layers: [satelliteMap, quakeLayer]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false,
    }).addTo(theMap);

}
