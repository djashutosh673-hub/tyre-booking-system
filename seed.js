const { sequelize, Tyre, User } = require('./models');

async function seed() {
  await sequelize.sync({ force: true });
  // Create admin user
  await User.create({
    name: 'Admin',
    email: 'admin@tyrehub.com',
    password: 'admin123',
    role: 'admin'
  });
  // Create mechanic user
  await User.create({
    name: 'Mechanic',
    email: 'mechanic@tyrehub.com',
    password: 'mech123',
    role: 'mechanic'
  });
  // Insert sample tyres
  const tyres = [
    { brand: 'CEAT', model: 'SecuraDrive', size: '205/55R16', price: 7990, type: 'All-Season', stock: 20 },
    { brand: 'Michelin', model: 'Pilot Sport 4', size: '225/45R17', price: 12500, type: 'Performance', stock: 15 },
    { brand: 'Bridgestone', model: 'Turanza T005', size: '215/60R16', price: 8200, type: 'Comfort', stock: 25 },
    { brand: 'Pirelli', model: 'Cinturato P7', size: '205/55R16', price: 9800, type: 'Eco', stock: 18 },
    { brand: 'Yokohama', model: 'Earth-1 EV', size: '205/55R16', price: 9100, type: 'Electric', stock: 10 },
    { brand: 'MRF', model: 'ZLX', size: '175/65R14', price: 4500, type: 'Economy', stock: 40 },
    { brand: 'Apollo', model: 'Alnac 4G', size: '185/60R15', price: 5400, type: 'All-Season', stock: 30 },
    { brand: 'Goodyear', model: 'Assurance', size: '195/55R16', price: 6700, type: 'Safety', stock: 22 },
  ];
  await Tyre.bulkCreate(tyres);
  console.log('Database seeded!');
  process.exit();
}
seed();