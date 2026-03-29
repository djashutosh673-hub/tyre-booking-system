const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    address: { type: DataTypes.TEXT },
    role: { type: DataTypes.ENUM('user', 'admin', 'mechanic'), defaultValue: 'user' },
  }, {
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
    },
  });

  User.prototype.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;
};