const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  scrollZoom: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  // Add marker
  const el = document.createElement('div');
  el.className = 'marker';

  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  }).setLngLat(loc.coordinates).addTo(map);

  // Add popup
  new mapboxgl.Popup({
    offset:30
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);


  // Extend map bounds to include current location
  bounds.extend(loc.coordinates)
});

map.fitBounds(bounds, {
  padding: {
    top:200,
    bottom: 200,
    left: 100,
    right: 100
  }
});