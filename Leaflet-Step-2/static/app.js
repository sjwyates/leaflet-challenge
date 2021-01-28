const earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"
const boundariesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

d3.json(earthquakesURL, (res) => {
    const quakes = res.features.map(quake => {
        return {
            magnitude: quake.properties.mag,
            latlng: quake.geometry.coordinates.slice(0, 2).reverse(),
            depth: quake.geometry.coordinates[2]
        }
    })
    d3.json(boundariesURL, (res) => {
        const boundaries = res.features;
        createMap(quakes, boundaries);
    })
})


function createMap(quakes, boundaries) {
    const quakeLayer = createQuakes(quakes);
    const boundaryLayer = createBoundaries(boundaries);
    const satelliteMap = createBaseMap("satellite-v9");
    const grayscaleMap = createBaseMap("light-v10");
    const outdoorsMap = createBaseMap("outdoors-v11");
    const baseMaps = {
        "Satellite": satelliteMap,
        "Grayscale": grayscaleMap,
        "Outdoors": outdoorsMap,
    }
    const overlayMaps = {
        "Earthquakes": quakeLayer,
        "Tectonic Plates": boundaryLayer,
    }
    const theMap = L.map("map-target", {
        center: [0, 0],
        zoom: 2,
        layers: [satelliteMap, boundaryLayer, quakeLayer],
    });
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false,
    }).addTo(theMap);
}

function createBaseMap (id) {
    return L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: `mapbox/${id}`,
        accessToken: API_KEY
    });
}

function createQuakes (quakes) {
    const minDepth = d3.min(quakes, q => q.depth);
    const maxDepth = d3.max(quakes, q => q.depth);
    console.log(maxDepth);
    const quakeCircles = quakes.map(quake => {
        const fillColor = d3.interpolateRdYlGn((quake.depth - minDepth) / (maxDepth - minDepth))
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
   return L.layerGroup(quakeCircles);
}

function createBoundaries (boundaries) {
    return L.geoJSON(boundaries, {
        style: {
            color: "#ffbb22",
            weight: 2,
            opacity: 0.8,
        }
    });
}