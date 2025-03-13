const sequelize = require('./src/config/database');
const models = require('./src/models');

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');

    await sequelize.sync({force :false}); 
    console.log('✅ All tables created successfully!');
  } catch (error) {
    console.error('❌ Error connecting to the database:', error);
  }
};

start();
