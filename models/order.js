module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    items: { type: DataTypes.JSONB, allowNull: false },
    total: { type: DataTypes.INTEGER, allowNull: false },
    paymentMethod: { type: DataTypes.STRING, defaultValue: 'Cash on Delivery' },
    orderStatus: { type: DataTypes.STRING, defaultValue: 'Confirmed' }, // order confirmation status
    deliveryStatus: { type: DataTypes.STRING, defaultValue: 'Pending' }, // delivery status: Pending, Assigned, Completed
    customerName: { type: DataTypes.STRING, allowNull: true },
    customerPhone: { type: DataTypes.STRING, allowNull: true },
    customerEmail: { type: DataTypes.STRING, allowNull: true },
    deliveryAddress: { type: DataTypes.TEXT, allowNull: true },
    latitude: { type: DataTypes.FLOAT, allowNull: true },
    longitude: { type: DataTypes.FLOAT, allowNull: true },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    assignedMechanicId: { type: DataTypes.INTEGER, allowNull: true }  // who is delivering
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: 'userId' });
    Order.belongsTo(models.User, { as: 'mechanic', foreignKey: 'assignedMechanicId' });
  };

  return Order;
};