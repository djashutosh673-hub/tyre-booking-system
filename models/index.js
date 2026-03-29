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

const User = require('./User')(sequelize);
const Tyre = require('./Tyre')(sequelize);
const Booking = require('./Booking')(sequelize);
const Order = require('./Order')(sequelize);

// Associations
User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Booking);
Booking.belongsTo(User);

// After defining models
Booking.belongsTo(User, { as: 'mechanic', foreignKey: 'mechanicId' });
User.hasMany(Booking, { as: 'assignedBookings', foreignKey: 'mechanicId' });

module.exports = { sequelize, User, Tyre, Booking, Order };