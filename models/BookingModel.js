const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const bookingsPath = path.join(__dirname, '../data/bookings.json');

class BookingModel {
    static getAll() {
        try {
            const data = fs.readFileSync(bookingsPath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            return [];
        }
    }

    static save(bookings) {
        fs.writeFileSync(bookingsPath, JSON.stringify(bookings, null, 2));
    }

    static create(bookingData) {
        const bookings = this.getAll();
        const newBooking = {
            id: uuidv4(),
            ...bookingData,
            status: 'Pending',
            createdAt: new Date().toISOString(),
            assignedMechanic: null
        };
        bookings.push(newBooking);
        this.save(bookings);
        return newBooking;
    }

    static findById(id) {
        const bookings = this.getAll();
        return bookings.find(b => b.id === id);
    }

    static updateStatus(id, status, mechanicId = null) {
        const bookings = this.getAll();
        const index = bookings.findIndex(b => b.id === id);
        if (index !== -1) {
            bookings[index].status = status;
            if (mechanicId) bookings[index].assignedMechanic = mechanicId;
            this.save(bookings);
            return true;
        }
        return false;
    }

    static findByPhone(phone) {
        const bookings = this.getAll();
        return bookings.filter(b => b.phone === phone);
    }
}

module.exports = BookingModel;