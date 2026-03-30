module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    items: { type: DataTypes.JSONB, allowNull: false },
    total: { type: DataTypes.INTEGER, allowNull: false },
    paymentMethod: { type: DataTypes.STRING, defaultValue: 'Cash on Delivery' },
    status: { type: DataTypes.STRING, defaultValue: 'Pending' },
    userId: { type: DataTypes.INTEGER, allowNull: true } // for logged-in users
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Order;
};