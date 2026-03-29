const { sequelize, User } = require('./models');

async function check() {
  await sequelize.authenticate();
  const mechanic = await User.findOne({ where: { email: 'mechanic@tyrehub.com' } });
  if (mechanic) {
    console.log('✅ Mechanic found:', mechanic.email, mechanic.role);
    const isMatch = await mechanic.comparePassword('mech123');
    console.log('Password match:', isMatch);
  } else {
    console.log('❌ Mechanic not found. Run `npm run seed` first.');
  }
  process.exit();
}
check();