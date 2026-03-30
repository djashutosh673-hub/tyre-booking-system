module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    name: { type: DataTypes.STRING, allowNull: false },
    vehicle: { type: DataTypes.STRING, allowNull: false },
    repair: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'Pending' },
    latitude: { type: DataTypes.FLOAT, allowNull: true },
    longitude: { type: DataTypes.FLOAT, allowNull: true },
    mechanicId: { type: DataTypes.INTEGER, allowNull: true },
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.User, { as: 'mechanic', foreignKey: 'mechanicId' });
  };

  return Booking;
};