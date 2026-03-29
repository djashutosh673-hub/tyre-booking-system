const { Booking, User } = require('../models');

exports.showLogin = (req, res) => {
  res.render('mechanic/login', { title: 'Mechanic Login', error: null });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user with role 'mechanic'
    const mechanic = await User.findOne({ where: { email, role: 'mechanic' } });
    if (!mechanic) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/mechanic/login');
    }
    const isMatch = await mechanic.comparePassword(password);
    if (!isMatch) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/mechanic/login');
    }
    req.session.user = { id: mechanic.id, name: mechanic.name, role: 'mechanic' };
    req.flash('success', 'Logged in as mechanic');
    res.redirect('/mechanic/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Server error');
    res.redirect('/mechanic/login');
  }
};

exports.dashboard = async (req, res) => {
  const bookings = await Booking.findAll();
  res.render('mechanic/dashboard', { title: 'Mechanic Dashboard', bookings });
};

exports.updateBookingStatus = async (req, res) => {
  const { id, status } = req.body;
  await Booking.update({ status }, { where: { id } });
  req.flash('success', 'Booking status updated');
  res.redirect('/mechanic/dashboard');
};

exports.assignBooking = async (req, res) => {
  const { id } = req.params;
  await Booking.update({ status: 'Assigned', mechanicId: req.session.user.id }, { where: { id } });
  req.flash('success', 'Booking assigned to you');
  res.redirect('/mechanic/dashboard');
};

exports.completeBooking = async (req, res) => {
  const { id } = req.params;
  await Booking.update({ status: 'Completed' }, { where: { id } });
  req.flash('success', 'Booking marked completed');
  res.redirect('/mechanic/dashboard');
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};