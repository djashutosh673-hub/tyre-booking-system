module.exports = (sequelize, DataTypes) => {
  const Tyre = sequelize.define('Tyre', {
    brand: DataTypes.STRING,
    model: DataTypes.STRING,
    size: DataTypes.STRING,
    price: DataTypes.INTEGER,
    type: DataTypes.STRING,
    stock: DataTypes.INTEGER,
  });

  return Tyre;
};