const { Tyre, Booking, Order, User } = require('../models');

exports.dashboard = async (req, res) => {
  const tyres = await Tyre.findAll();
  const bookings = await Booking.findAll();
  const orders = await Order.findAll({ include: User });
  res.render('admin/dashboard', { title: 'Admin Dashboard', tyres, bookings, orders });
};

exports.showAddTyre = (req, res) => {
  res.render('admin/add-tyre', { title: 'Add Tyre' });
};

exports.addTyre = async (req, res) => {
  const { brand, model, size, price, type, stock, image } = req.body;
  try {
    await Tyre.create({ brand, model, size, price, type, stock, image });
    req.flash('success', 'Tyre added');
    res.redirect('/admin/dashboard');
  } catch (err) {
    req.flash('error', 'Failed to add tyre');
    res.redirect('/admin/tyres/add');
  }
};

exports.showEditTyre = async (req, res) => {
  const tyre = await Tyre.findByPk(req.params.id);
  if (!tyre) return res.redirect('/admin/dashboard');
  res.render('admin/edit-tyre', { title: 'Edit Tyre', tyre });
};

exports.editTyre = async (req, res) => {
  const { brand, model, size, price, type, stock, image } = req.body;
  await Tyre.update({ brand, model, size, price, type, stock, image }, { where: { id: req.params.id } });
  req.flash('success', 'Tyre updated');
  res.redirect('/admin/dashboard');
};

exports.deleteTyre = async (req, res) => {
  await Tyre.destroy({ where: { id: req.params.id } });
  req.flash('success', 'Tyre deleted');
  res.redirect('/admin/dashboard');
};

exports.viewBookings = async (req, res) => {
  const bookings = await Booking.findAll();
  res.render('admin/bookings', { title: 'Manage Bookings', bookings });
};