const { Booking, User, Tyre, Order } = require('../models');

exports.dashboard = async (req, res) => {
  try {
    const totalBookings = await Booking.count();
    const totalUsers = await User.count({ where: { role: 'user' } });
    const totalMechanics = await User.count({ where: { role: 'mechanic' } });
    const totalTyres = await Tyre.count();
    const recentBookings = await Booking.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']]
    });
    const recentOrders = await Order.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']]
    });
    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      totalBookings,
      totalUsers,
      totalMechanics,
      totalTyres,
      recentBookings,
      recentOrders
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load dashboard');
    res.redirect('/');
  }
};

exports.showAddTyre = (req, res) => {
  res.render('admin/add-tyre', { title: 'Add Tyre', tyre: null });
};

exports.addTyre = async (req, res) => {
  try {
    const { brand, model, size, price, type, stock } = req.body;
    await Tyre.create({ brand, model, size, price, type, stock });
    req.flash('success', 'Tyre added successfully');
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to add tyre');
    res.redirect('/admin/tyres/add');
  }
};

exports.showEditTyre = async (req, res) => {
  try {
    const tyre = await Tyre.findByPk(req.params.id);
    if (!tyre) {
      req.flash('error', 'Tyre not found');
      return res.redirect('/admin/dashboard');
    }
    res.render('admin/edit-tyre', { title: 'Edit Tyre', tyre });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load tyre');
    res.redirect('/admin/dashboard');
  }
};

exports.editTyre = async (req, res) => {
  try {
    const { brand, model, size, price, type, stock } = req.body;
    await Tyre.update(
      { brand, model, size, price, type, stock },
      { where: { id: req.params.id } }
    );
    req.flash('success', 'Tyre updated successfully');
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to update tyre');
    res.redirect(`/admin/tyres/edit/${req.params.id}`);
  }
};

exports.deleteTyre = async (req, res) => {
  try {
    await Tyre.destroy({ where: { id: req.params.id } });
    req.flash('success', 'Tyre deleted successfully');
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to delete tyre');
    res.redirect('/admin/dashboard');
  }
};

exports.viewBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.render('admin/bookings', { title: 'All Bookings', bookings });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load bookings');
    res.redirect('/admin/dashboard');
  }
};

// Optional: view all orders
exports.viewAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ order: [['createdAt', 'DESC']] });
    res.render('admin/orders', { title: 'All Orders', orders });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load orders');
    res.redirect('/admin/dashboard');
  }
};