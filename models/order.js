const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Order', {
    items: { type: DataTypes.JSONB, allowNull: false }, // [{ tyreId, name, price, quantity }]
    total: { type: DataTypes.INTEGER, allowNull: false },
    paymentMethod: { type: DataTypes.STRING, defaultValue: 'Cash on Delivery' },
    status: { type: DataTypes.STRING, defaultValue: 'Pending' },
  });
};