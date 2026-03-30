process.removeAllListeners('warning');
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const config = require('./config');
const { sequelize } = require('./models');

const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(flash());

// Global variables for views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  res.locals.cartCount = req.session.cart ? req.session.cart.reduce((sum, item) => sum + item.quantity, 0) : 0;
  next();
});

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/', require('./routes/userRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.use('/mechanic', require('./routes/mechanicRoutes'));
app.use('/booking', require('./routes/bookingRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });

});

// Sync database and start server
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ PostgreSQL database connected (Neon.tech)');
    app.listen(config.port, () => {
      console.log(`✅ Server running on http://localhost:${config.port}`);
    });
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
  });