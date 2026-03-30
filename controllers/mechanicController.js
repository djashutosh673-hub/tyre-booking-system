const { Booking, Order, User } = require('../models');

exports.showLogin = (req, res) => {
  res.render('mechanic/login', { title: 'Mechanic Login', error: null });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
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
  const serviceBookings = await Booking.findAll({ order: [['createdAt', 'DESC']] });
  const deliveryOrders = await Order.findAll({
    where: { deliveryStatus: ['Pending', 'Assigned'] },
    order: [['createdAt', 'DESC']]
  });
  res.render('mechanic/dashboard', {
    title: 'Mechanic Dashboard',
    serviceBookings,
    deliveryOrders,
    user: req.session.user
  });
};

exports.assignBooking = async (req, res) => {
  const { id } = req.params;
  await Booking.update(
    { status: 'Assigned', mechanicId: req.session.user.id },
    { where: { id, status: 'Pending' } }
  );
  req.flash('success', 'Service request assigned to you');
  res.redirect('/mechanic/dashboard');
};

exports.completeBooking = async (req, res) => {
  const { id } = req.params;
  await Booking.update(
    { status: 'Completed' },
    { where: { id, mechanicId: req.session.user.id } }
  );
  req.flash('success', 'Service marked completed');
  res.redirect('/mechanic/dashboard');
};

exports.assignDelivery = async (req, res) => {
  const { id } = req.params;
  await Order.update(
    { deliveryStatus: 'Assigned', assignedMechanicId: req.session.user.id },
    { where: { id, deliveryStatus: 'Pending' } }
  );
  req.flash('success', 'Delivery order assigned to you');
  res.redirect('/mechanic/dashboard');
};

exports.completeDelivery = async (req, res) => {
  const { id } = req.params;
  await Order.update(
    { deliveryStatus: 'Completed' },
    { where: { id, assignedMechanicId: req.session.user.id } }
  );
  req.flash('success', 'Delivery marked completed');
  res.redirect('/mechanic/dashboard');
};

exports.updateBookingStatus = async (req, res) => {
  const { id, status } = req.body;
  await Booking.update({ status }, { where: { id } });
  req.flash('success', 'Booking status updated');
  res.redirect('/mechanic/dashboard');
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};