const { Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(config.databaseUrl, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const User = require('./user')(sequelize);
const Tyre = require('./tyre')(sequelize);
const Booking = require('./Booking')(sequelize);
const Order = require('./order')(sequelize);

// Associations
User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Booking);
Booking.belongsTo(User);

// After defining models
Booking.belongsTo(User, { as: 'mechanic', foreignKey: 'mechanicId' });
User.hasMany(Booking, { as: 'assignedBookings', foreignKey: 'mechanicId' });

module.exports = { sequelize, User, Tyre, Booking, Order };