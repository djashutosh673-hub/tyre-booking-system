let socket = io();
let currentBookingId = null;
let watchId = null;
let mechanicMap, userLocationMarker, mechanicMarker;

// Join mechanics room to receive new bookings
socket.emit('join-mechanics');

// ---------- No Google Maps callback needed – we init map manually ----------
// This empty function prevents the "not a function" error if callback is accidentally left
window.initMap = function() {
    console.log('✅ initMap called (mechanic) – no action needed');
};

// ---------- Load pending bookings on page load ----------
async function loadPendingBookings() {
    const response = await fetch('/api/mechanic/pending');
    const bookings = await response.json();
    renderPendingList(bookings);
}

function renderPendingList(bookings) {
    const container = document.getElementById('pending-list');
    if (bookings.length === 0) {
        container.innerHTML = '<p>No pending requests.</p>';
        return;
    }
    let html = '';
    bookings.forEach(booking => {
        html += `
            <div class="pending-item" id="booking-${booking.id}">
                <p><strong>${booking.userName}</strong> - ${booking.service}</p>
                <p>📍 Location: (${booking.location.lat.toFixed(4)}, ${booking.location.lng.toFixed(4)})</p>
                <button onclick="acceptBooking('${booking.id}')">✅ Accept</button>
            </div>
        `;
    });
    container.innerHTML = html;
}

// ---------- Accept Booking ----------
window.acceptBooking = async function(bookingId) {
    const response = await fetch(`/api/bookings/${bookingId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mechanicId: 'mechanic-1' })
    });
    const data = await response.json();
    if (data.success) {
        currentBookingId = bookingId;
        document.getElementById('current-job').innerHTML = `
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Status:</strong> Accepted</p>
        `;
        // Remove from pending list
        document.getElementById(`booking-${bookingId}`)?.remove();

        // Join the booking room
        socket.emit('join-booking', bookingId);

        // Initialize map with user location
        const booking = data.booking;
        initMechanicMap(booking.location.lat, booking.location.lng);

        // Start sending live location
        startLocationTracking();
    }
};

// ---------- Google Map for Mechanic ----------
function initMechanicMap(userLat, userLng) {
    const userLocation = { lat: userLat, lng: userLng };
    
    // Create map if not already created
    if (!mechanicMap) {
        mechanicMap = new google.maps.Map(document.getElementById('mechanic-map'), {
            center: userLocation,
            zoom: 14
        });

        // User's location marker
        userLocationMarker = new google.maps.Marker({
            position: userLocation,
            map: mechanicMap,
            title: 'Customer Location',
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });

        // Mechanic marker (will be updated via geolocation)
        mechanicMarker = new google.maps.Marker({
            position: userLocation, // temporary
            map: mechanicMap,
            title: 'Your Location',
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });
    } else {
        // Update existing markers
        userLocationMarker.setPosition(userLocation);
        mechanicMap.setCenter(userLocation);
    }
}

// ---------- Live Location Tracking (send to server) ----------
function startLocationTracking() {
    if (!navigator.geolocation) {
        alert('Geolocation not supported');
        return;
    }

    watchId = navigator.geolocation.watchPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            // Update own map marker
            if (mechanicMarker) {
                mechanicMarker.setPosition({ lat, lng });
                mechanicMap.setCenter({ lat, lng });
            }
            // Send location to server (to broadcast to user)
            if (currentBookingId) {
                socket.emit('mechanic-location', {
                    bookingId: currentBookingId,
                    lat,
                    lng
                });
            }
        },
        (error) => console.error('Geolocation error:', error),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );
}

// Stop tracking when job is done (optional)
function stopLocationTracking() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
}

// ---------- Socket: New Booking ----------
socket.on('new-booking', (booking) => {
    // Add to pending list dynamically
    const container = document.getElementById('pending-list');
    const noPending = container.querySelector('p');
    if (noPending) container.innerHTML = '';

    const div = document.createElement('div');
    div.className = 'pending-item';
    div.id = `booking-${booking.id}`;
    div.innerHTML = `
        <p><strong>${booking.userName}</strong> - ${booking.service}</p>
        <p>📍 Location: (${booking.location.lat.toFixed(4)}, ${booking.location.lng.toFixed(4)})</p>
        <button onclick="acceptBooking('${booking.id}')">✅ Accept</button>
    `;
    container.appendChild(div);
});

// Load pending bookings on page start
window.onload = () => {
    loadPendingBookings();
};