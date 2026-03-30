const { Booking, User } = require('../models');

// Helper function for SMS (console log for now)
function sendSmsAlert(toPhone, bookingDetails) {
  const message = `🔧 NEW SERVICE BOOKING 🔧\n\nCustomer: ${bookingDetails.name}\nVehicle: ${bookingDetails.vehicle}\nRepair: ${bookingDetails.repair}\nPhone: ${bookingDetails.phone}\nAddress: ${bookingDetails.address || 'Not provided'}\nBooking ID: ${bookingDetails.id}\n\nView on map: ${bookingDetails.latitude && bookingDetails.longitude ? `https://maps.google.com/?q=${bookingDetails.latitude},${bookingDetails.longitude}` : 'No location provided'}`;
  console.log(`\n📱 SMS TO ${toPhone}:`);
  console.log(message);
  console.log('----------------------------------------\n');
}

// Show the booking form
exports.showBook = (req, res) => {
  res.render('book', { title: 'Book Home Service', error: null, success: null });
};

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { name, vehicle, repair, phone, address, latitude, longitude } = req.body;
    const booking = await Booking.create({
      name,
      vehicle,
      repair,
      phone,
      address,
      status: 'Pending',
      latitude: latitude || null,
      longitude: longitude || null,
    });
    sendSmsAlert('7878939136', booking);
    res.redirect(`/booking/confirmation/${booking.id}`);
  } catch (err) {
    console.error('Booking creation error:', err);
    req.flash('error', 'Server error, please try again.');
    res.redirect('/booking/book');
  }
};

// Show confirmation page
exports.showConfirmation = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      req.flash('error', 'Booking not found');
      return res.redirect('/booking/book');
    }
    res.render('booking-confirmation', { title: 'Booking Confirmed', booking });
  } catch (err) {
    console.error('Confirmation error:', err);
    req.flash('error', 'Could not load booking');
    res.redirect('/booking/book');
  }
};

// Display tracking form
exports.trackForm = (req, res) => {
  res.render('track', { title: 'Track Service', booking: null, phone: '' });
};

// Handle tracking request (with mechanic details)
exports.track = async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    req.flash('error', 'Please enter a phone number');
    return res.redirect('/booking/track');
  }
  try {
    const booking = await Booking.findOne({
      where: { phone },
      include: [
        {
          model: User,
          as: 'mechanic',          // must match alias in Booking.associate
          attributes: ['name', 'phone']
        }
      ]
    });
    res.render('track', { title: 'Track Service', booking, phone });
  } catch (err) {
    console.error('Tracking error:', err);
    req.flash('error', 'Error finding booking');
    res.redirect('/booking/track');
  }
};