export const displayMap = (location) => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2hpY2tzcmF0ZWQxMjMiLCJhIjoiY2t1YTBkZ3U5MGMyaTJ1cGdraXl1NzZqNSJ9.W68YSWQWrZSSRjNM66KPyg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/chicksrated123/ckua0f6g62egp17mwua7axbwo',
    scrollZoom: false
    // center: [34.111745, -118.113491],
    // zoom: 10,
    // interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
    // Create marker object
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    })

        .setLngLat(loc.coordinates)
        .addTo(map);

    // Add popup
    new mapboxgl.Popup({
        offset:30
    })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map);

    // Extend map bounds to include curent location
    bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
    padding: {
        left: 100,
        top: 200,
        bottom: 200,
        right: 100
    }
});
}
