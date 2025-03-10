mapboxgl.accessToken = maptoken;

// const cordinates=<%= JSON.stringify(data.geometry.cordinates)%>;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: cordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

console.log();
// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker({ color: "red" })
  .setLngLat(cordinates)
  .addTo(map);
