const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Tyre', {
    brand: { type: DataTypes.STRING, allowNull: false },
    model: { type: DataTypes.STRING, allowNull: false },
    size: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.STRING },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    image: { type: DataTypes.STRING },
  });
};