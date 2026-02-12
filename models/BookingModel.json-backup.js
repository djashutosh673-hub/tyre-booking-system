const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'bookings.json');

// Auto-create data folder and file if missing
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
}

const readBookings = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('⚠️ Corrupted bookings.json – resetting to empty array.');
        fs.writeFileSync(DATA_FILE, '[]');
        return [];
    }
};

const writeBookings = (bookings) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2));
};

const createBooking = (bookingData) => {
    const bookings = readBookings();
    const newBooking = {
        id: uuidv4(),
        ...bookingData,
        status: 'pending',
        mechanicId: null,
        createdAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    writeBookings(bookings);
    return newBooking;
};

const getPendingBookings = () => {
    const bookings = readBookings();
    return bookings.filter(b => b.status === 'pending');
};

const getBookingById = (id) => {
    const bookings = readBookings();
    return bookings.find(b => b.id === id);
};

const acceptBooking = (id, mechanicId) => {
    const bookings = readBookings();
    const booking = bookings.find(b => b.id === id);
    if (booking && booking.status === 'pending') {
        booking.status = 'accepted';
        booking.mechanicId = mechanicId;
        writeBookings(bookings);
        return booking;
    }
    return null;
};

const updateBookingStatus = (id, status) => {
    const bookings = readBookings();
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        booking.status = status;
        writeBookings(bookings);
        return booking;
    }
    return null;
};

module.exports = {
    createBooking,
    getPendingBookings,
    getBookingById,
    acceptBooking,
    updateBookingStatus
};