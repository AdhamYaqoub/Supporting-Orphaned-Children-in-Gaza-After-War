const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./src/config/database'); // Import database settings
const donationRoutes = require('./src/routes/donation.routes'); // Import donation routes
const transactionsRoutes = require('./src/routes/transactions.routes'); // Import transactions routes
const emergencyCampaigns = require('./src/routes/emergencyCampaigns.routes'); // Import emergencyCampaigns routes


// **Import models to define them with the database**

const app = express();

// **Middleware** to parse JSON data in requests
app.use(bodyParser.json());

// **Use donation routes**
app.use('/api', donationRoutes);

// **Use transactions routes**
app.use('/api', transactionsRoutes);

// **Use Emergency Campaigns routes**
app.use('/api', emergencyCampaigns);


// **Test database connection**
sequelize.authenticate()
    .then(() => console.log('✅ Connected to the database'))
    .catch(err => console.error('❌ Unable to connect to the database:', err));

// **Sync models with the database** (preferably used only during development)
sequelize.sync()
    .then(() => console.log('🔄 Database synced'))
    .catch(err => console.error('⚠️ Error syncing database:', err));

// **Start the server**
const PORT =  5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});