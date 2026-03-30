const { sequelize, Tyre, User } = require('./models');

async function seed() {
  await sequelize.sync({ force: true });

  // Create users
  await User.create({ name: 'Admin', email: 'admin@tyrehub.com', password: 'admin123', role: 'admin' });
  await User.create({ name: 'Mechanic', email: 'mechanic@tyrehub.com', password: 'mech123', role: 'mechanic' });

  // All sizes from your images (unique)
  const allSizes = [
    "135/80R13", "145/70R13", "155/70R13", "145/80R13", "165/70R13",
    "175/70R13", "155/80R13", "165/75R13", "185/70R13", "165/70R14",
    "175/70R14", "175/80R13", "175/75R14", "185/70R14", "185/80R13",
    "185/75R14", "195/70R14", "175/60R13", "165/65R13", "175/65R13",
    "185/60R13", "185/55R14", "165/65R14", "175/60R14", "195/55R14",
    "195/50R15", "175/65R14", "185/60R14", "185/55R15", "195/60R14",
    "205/55R14", "205/50R15", "185/65R14", "205/60R14", "195/50R16",
    "195/55R15", "205/55R15", "215/50R16", "195/65R14", "215/60R14"
  ];

  // Define each tyre model and which sizes it supports
  const tyreModels = [
    { brand: 'CEAT', model: 'SecuraDrive', basePrice: 7990, sizes: ['205/55R16', '215/60R16', '185/65R14', '195/60R14'] },
    { brand: 'Michelin', model: 'Pilot Sport 4', basePrice: 12500, sizes: ['225/45R17', '205/55R16', '195/55R15', '215/50R16'] },
    { brand: 'Bridgestone', model: 'Turanza T005', basePrice: 8200, sizes: ['215/60R16', '205/55R16', '195/60R14', '185/65R14'] },
    { brand: 'Pirelli', model: 'Cinturato P7', basePrice: 9800, sizes: ['205/55R16', '215/50R16', '195/55R15', '205/55R14'] },
    { brand: 'Yokohama', model: 'Earth-1 EV', basePrice: 9100, sizes: ['205/55R16', '195/60R14', '185/65R14', '215/60R14'] },
    { brand: 'MRF', model: 'ZLX', basePrice: 4500, sizes: ['175/65R14', '185/60R13', '165/70R13', '175/70R13'] },
    { brand: 'Apollo', model: 'Alnac 4G', basePrice: 5400, sizes: ['185/60R15', '175/70R14', '165/65R14', '195/55R14'] },
    { brand: 'Goodyear', model: 'Assurance', basePrice: 6700, sizes: ['195/55R16', '205/55R16', '215/60R14', '185/60R14'] }
  ];

  // Insert all tyre records
  for (const tm of tyreModels) {
    for (const size of tm.sizes) {
      await Tyre.create({
        brand: tm.brand,
        model: tm.model,
        size: size,
        price: tm.basePrice,
        type: 'All-Season',
        stock: 20
      });
    }
  }

  console.log('✅ Database seeded with multiple sizes!');
  process.exit();
}
seed();