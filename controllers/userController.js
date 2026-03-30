const { Tyre, Order, User } = require('../models');

/* ================= WELCOME ================= */
exports.getWelcome = (req, res) => {
  if (req.session.user) return res.redirect('/home');
  res.render('welcome');
};

/* ================= HOME ================= */
exports.getHome = (req, res) => {
  res.render('index', { title: 'TyreHub - Premium Tyres & Service' });
};

/* ================= SHOP (GROUPED) ================= */
exports.getShop = async (req, res) => {
  try {
    const allTyres = await Tyre.findAll();
    const groups = allTyres.reduce((acc, tyre) => {
      const key = `${tyre.brand}|${tyre.model}`;
      if (!acc[key]) {
        acc[key] = { brand: tyre.brand, model: tyre.model, sizes: [] };
      }
      const existing = acc[key].sizes.find(s => s.size === tyre.size);
      if (!existing) {
        acc[key].sizes.push({
          id: tyre.id,
          size: tyre.size,
          price: tyre.price,
          stock: tyre.stock
        });
      }
      return acc;
    }, {});
    const tyreGroups = Object.values(groups);
    res.render('shop', { title: 'Shop', tyreGroups });
  } catch (err) {
    console.error(err);
    res.render('shop', { title: 'Shop', tyreGroups: [] });
  }
};

/* ================= CART METHODS ================= */
exports.getCart = async (req, res) => {
  const cart = req.session.cart || [];
  const tyreIds = cart.map(i => i.id);
  const tyres = await Tyre.findAll({ where: { id: tyreIds } });
  const cartItems = cart.map(c => {
    const tyre = tyres.find(t => t.id == c.id);
    return tyre ? { ...tyre.dataValues, quantity: c.quantity } : null;
  }).filter(Boolean);
  const total = cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  res.render('cart', { title: 'Your Cart', cart: cartItems, total });
};

exports.addToCart = async (req, res) => {
  const tyreId = req.params.id;
  if (!req.session.cart) req.session.cart = [];
  const existingItem = req.session.cart.find(i => i.id == tyreId);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    const tyre = await Tyre.findByPk(tyreId);
    if (!tyre) {
      req.flash('error', 'Tyre not found');
      return res.redirect('/shop');
    }
    req.session.cart.push({
      id: tyre.id,
      name: `${tyre.brand} ${tyre.model}`,
      size: tyre.size,
      price: tyre.price,
      quantity: 1
    });
  }
  res.redirect('/shop');
};

exports.updateCart = (req, res) => {
  const { id, quantity } = req.body;
  if (!req.session.cart) req.session.cart = [];
  const item = req.session.cart.find(i => i.id == id);
  if (item) {
    if (quantity <= 0) {
      req.session.cart = req.session.cart.filter(i => i.id != id);
    } else {
      item.quantity = parseInt(quantity);
    }
  }
  res.redirect('/cart');
};

exports.removeFromCart = (req, res) => {
  const id = req.params.id;
  if (req.session.cart) {
    req.session.cart = req.session.cart.filter(i => i.id != id);
  }
  res.redirect('/cart');
};

/* ================= CHECKOUT ================= */
exports.getCheckout = async (req, res) => {
  if (!req.session.user) {
    req.flash('error', 'Please login to checkout');
    return res.redirect('/auth/login');
  }
  const cart = req.session.cart || [];
  if (cart.length === 0) return res.redirect('/shop');
  const tyreIds = cart.map(i => i.id);
  const tyres = await Tyre.findAll({ where: { id: tyreIds } });
  const cartItems = cart.map(c => {
    const tyre = tyres.find(t => t.id == c.id);
    return { ...tyre.dataValues, quantity: c.quantity };
  });
  const total = cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  res.render('checkout', {
    title: 'Checkout',
    cartItems,
    total,
    paymentMethod: 'Cash on Delivery',
    user: req.session.user
  });
};

/* ================= PLACE ORDER ================= */
exports.placeOrder = async (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');

  const cart = req.session.cart || [];
  if (cart.length === 0) return res.redirect('/shop');

  const {
    customerName,
    customerPhone,
    customerEmail,
    deliveryAddress,
    latitude,
    longitude,
    paymentMethod
  } = req.body;

  if (!customerName || !customerPhone || !customerEmail || !deliveryAddress) {
    req.flash('error', 'Please fill all delivery details.');
    return res.redirect('/checkout');
  }

  const tyreIds = cart.map(i => i.id);
  const tyres = await Tyre.findAll({ where: { id: tyreIds } });
  const items = cart.map(c => {
    const tyre = tyres.find(t => t.id == c.id);
    return {
      tyreId: tyre.id,
      name: `${tyre.brand} ${tyre.model} (${tyre.size})`,
      price: tyre.price,
      quantity: c.quantity
    };
  });
  const total = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  // CREATE ORDER AND CAPTURE THE RETURNED OBJECT
  const newOrder = await Order.create({
    userId: req.session.user.id,
    items,
    total,
    paymentMethod: paymentMethod || 'Cash on Delivery',
    status: 'Confirmed',
    customerName,
    customerPhone,
    customerEmail,
    deliveryAddress,
    latitude: latitude || null,
    longitude: longitude || null,
  });

  // Reduce stock
  for (const item of items) {
    const tyre = await Tyre.findByPk(item.tyreId);
    tyre.stock -= item.quantity;
    await tyre.save();
  }

  // Update user profile if changed
  const user = await User.findByPk(req.session.user.id);
  if (deliveryAddress !== user.address || customerPhone !== user.phone) {
    user.address = deliveryAddress;
    user.phone = customerPhone;
    await user.save();
  }

  req.session.cart = [];

  // PASS orderId TO THE SUCCESS PAGE
  res.render('order-success', {
    title: 'Order Placed',
    message: 'Your order has been placed! You will pay cash on delivery.',
    orderId: newOrder.id
  });
};

/* ================= ORDER TRACKING ================= */
exports.trackOrderForm = (req, res) => {
  res.render('track-order', { title: 'Track Your Order', order: null, identifier: '' });
};

exports.trackOrder = async (req, res) => {
  const { identifier } = req.body;
  if (!identifier) {
    req.flash('error', 'Please enter order ID or phone number');
    return res.redirect('/track-order');
  }

  try {
    let order;
    if (!isNaN(identifier) && identifier.toString().length < 10) {
      order = await Order.findByPk(parseInt(identifier));
    } else {
      order = await Order.findOne({ where: { customerPhone: identifier } });
    }
    res.render('track-order', { title: 'Track Your Order', order, identifier });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error finding order');
    res.redirect('/track-order');
  }
};