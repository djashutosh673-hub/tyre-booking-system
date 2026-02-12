// ---------- Global variables ----------
let map, marker;
let trackingMap, mechanicMarker, userMarker;
let socket = io();

// ---------- Google Maps Initialization (called via callback) ----------
window.initMap = function() {
    console.log('✅ initMap called (user)');
    
    // Default location (New York)
    const defaultLocation = { lat: 40.7128, lng: -74.0060 };

    map = new google.maps.Map(document.getElementById('map'), {
        center: defaultLocation,
        zoom: 12
    });

    // Click on map to set location
    map.addListener('click', (e) => {
        placeMarker(e.latLng);
    });

    // Detect my location button
    document.getElementById('detectLocation').addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    map.setCenter(pos);
                    placeMarker(new google.maps.LatLng(pos.lat, pos.lng));
                },
                () => alert('Geolocation failed')
            );
        }
    });
};

// Place or move marker
function placeMarker(location) {
    if (marker) {
        marker.setPosition(location);
    } else {
        marker = new google.maps.Marker({
            position: location,
            map: map
        });
    }
    document.getElementById('lat').value = location.lat();
    document.getElementById('lng').value = location.lng();
}

// ---------- Booking Submission ----------
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const userName = document.getElementById('userName').value;
    const userPhone = document.getElementById('userPhone').value;
    const service = document.getElementById('service').value;
    const lat = document.getElementById('lat').value;
    const lng = document.getElementById('lng').value;

    if (!lat || !lng) {
        alert('Please select your location on the map');
        return;
    }

    const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, userPhone, service, lat, lng })
    });

    const data = await response.json();
    if (data.success) {
        const bookingId = data.bookingId;
        // Hide form, show tracking
        document.getElementById('booking-form').classList.add('hidden');
        document.getElementById('tracking-section').classList.remove('hidden');
        document.getElementById('bookingIdDisplay').textContent = bookingId;

        // Join Socket.IO room for this booking
        socket.emit('join-booking', bookingId);

        // Initialize tracking map
        initTrackingMap(bookingId);
    } else {
        alert('Booking failed');
    }
});

// ---------- Tracking Map Initialization ----------
function initTrackingMap(bookingId) {
    const userLat = parseFloat(document.getElementById('lat').value);
    const userLng = parseFloat(document.getElementById('lng').value);
    const userLocation = { lat: userLat, lng: userLng };

    trackingMap = new google.maps.Map(document.getElementById('tracking-map'), {
        center: userLocation,
        zoom: 14
    });

    // User location marker
    userMarker = new google.maps.Marker({
        position: userLocation,
        map: trackingMap,
        title: 'Your Location',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });

    // Listen for mechanic acceptance
    socket.on('mechanic-accepted', (data) => {
        document.getElementById('status').innerHTML = '✅ Mechanic accepted your request. En route...';
    });

    // Listen for mechanic location updates
    socket.on('mechanic-location-update', (location) => {
        if (!mechanicMarker) {
            mechanicMarker = new google.maps.Marker({
                position: location,
                map: trackingMap,
                title: 'Mechanic',
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            });
        } else {
            mechanicMarker.setPosition(location);
        }
        // Center map on mechanic
        trackingMap.setCenter(location);
    });
}