// استيراد المكتبات
const express = require('express');
const sequelize = require('./src/config/database');
const userRoutes = require('./src/routes/user.routes'); // تأكد من استيراد المسارات بشكل صحيح

const start = async () => {
  try {
    // الاتصال بقاعدة البيانات
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');

    await sequelize.sync({ force: false });
    console.log('✅ All tables created successfully!');

    const app = express();
    app.use(express.json()); 

    app.use('/api', userRoutes);

    const PORT = 3000; 
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  } catch (error) {
    console.error('❌ Error connecting to the database:', error);
  }
};

start();
