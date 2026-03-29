const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Booking', {
    name: { type: DataTypes.STRING, allowNull: false },
    vehicle: { type: DataTypes.STRING, allowNull: false },
    repair: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.TEXT },
    latitude: { type: DataTypes.DECIMAL(10, 8), allowNull: true },
    longitude: { type: DataTypes.DECIMAL(11, 8), allowNull: true },
    status: { type: DataTypes.ENUM('Pending', 'Assigned', 'Completed'), defaultValue: 'Pending' },
    mechanicId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'Users', key: 'id' } }
  });
};