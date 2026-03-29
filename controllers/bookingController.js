const { Booking } = require('../models');

// Helper function to send SMS notification to the given phone number
// For now, logs to console. Replace with actual SMS API (Twilio, etc.)
function sendSmsAlert(toPhone, bookingDetails) {
  const message = `🔧 NEW SERVICE BOOKING 🔧\n\nCustomer: ${bookingDetails.name}\nVehicle: ${bookingDetails.vehicle}\nRepair: ${bookingDetails.repair}\nPhone: ${bookingDetails.phone}\nAddress: ${bookingDetails.address || 'Not provided'}\nLocation: ${bookingDetails.latitude}, ${bookingDetails.longitude}\nBooking ID: ${bookingDetails.id}\n\nView on map: https://maps.google.com/?q=${bookingDetails.latitude},${bookingDetails.longitude}`;
  
  // Log to console (you can replace with actual SMS API call)
  console.log(`\n📱 SMS TO ${toPhone}:`);
  console.log(message);
  console.log('----------------------------------------\n');
  
  // Example with Twilio (uncomment and configure if you have Twilio account):
  /*
  const twilio = require('twilio');
  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE,
    to: toPhone
  }).then(msg => console.log(`SMS sent: ${msg.sid}`)).catch(err => console.error(err));
  */
}

exports.showBook = (req, res) => {
  res.render('book', { title: 'Book Home Service', error: null, success: null });
};

exports.createBooking = async (req, res) => {
  const { name, vehicle, repair, phone, address, latitude, longitude } = req.body;
  if (!name || !vehicle || !repair || !phone) {
    return res.render('book', { title: 'Book Home Service', error: 'All fields required', success: null });
  }
  try {
    const booking = await Booking.create({
      name, vehicle, repair, phone, address,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      status: 'Pending'
    });
    
    // Send SMS alert to the fixed number 7878939136
    sendSmsAlert('7878939136', booking);
    
    res.redirect(`/booking/confirmation/${booking.id}`);
  } catch (err) {
    console.error(err);
    res.render('book', { title: 'Book Home Service', error: 'Server error, please try again', success: null });
  }
};

exports.showConfirmation = async (req, res) => {
  const { id } = req.params;
  const booking = await Booking.findByPk(id);
  if (!booking) {
    req.flash('error', 'Booking not found');
    return res.redirect('/booking/book');
  }
  res.render('booking-confirmation', { title: 'Booking Confirmed', booking });
};

exports.trackForm = (req, res) => {
  res.render('track', { title: 'Track Service', booking: null, phone: '' });
};

exports.track = async (req, res) => {
  const { phone } = req.body;
  const booking = await Booking.findOne({ where: { phone } });
  res.render('track', { title: 'Track Service', booking, phone });
};