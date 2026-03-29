const { User } = require('../models');

exports.showLogin = (req, res) => {
  res.render('auth/login', { title: 'Login' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/auth/login');
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/auth/login');
    }
    req.session.user = { id: user.id, name: user.name, role: user.role, email: user.email };
    req.flash('success', 'Logged in successfully');
    if (user.role === 'admin') return res.redirect('/admin/dashboard');
    if (user.role === 'mechanic') return res.redirect('/mechanic/dashboard');
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Server error');
    res.redirect('/auth/login');
  }
};

exports.showRegister = (req, res) => {
  res.render('auth/register', { title: 'Register' });
};

exports.register = async (req, res) => {
  const { name, email, password, password2, phone, address } = req.body;
  if (password !== password2) {
    req.flash('error', 'Passwords do not match');
    return res.redirect('/auth/register');
  }
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      req.flash('error', 'Email already registered');
      return res.redirect('/auth/register');
    }
    await User.create({ name, email, password, phone, address, role: 'user' });
    req.flash('success', 'Registration successful. Please login.');
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Registration failed');
    res.redirect('/auth/register');
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};