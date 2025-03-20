const express = require("express"); // Import express
const bodyParser = require('body-parser'); // Import body-parser
const sequelize = require('./src/config/database'); // Import database settings
const dashboardRoutes = require("./src/routes/dashboard.routes");  // Import dashboard routes
const donationRoutes = require('./src/routes/donation.routes'); // Import donation routes
const authRoutes = require("./src/routes/auth.routes"); // Import auth routes
const usersRoutes = require("./src/routes/user.routes"); // Import users routes
const notificationsRoutes = require("./src/routes/notifications.routes"); // Import notifications routes
const transactionsRoutes = require('./src/routes/transactions.routes'); // Import transactions routes
const emergencyCampaigns = require('./src/routes/emergencyCampaigns.routes'); // Import emergencyCampaigns routes
const addtionalFeatures = require('./src/routes/additionalFeatures.routes'); // Import additionalFeatures routes

// create express app
const app = express();

app.use(express.json());

// add routes 
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationsRoutes);


// Middleware** to parse JSON data in requests
app.use(bodyParser.json());

// **Use donation routes**
app.use('/api', donationRoutes);

// **Use transactions routes**
app.use('/api', transactionsRoutes);

// **Use Emergency Campaigns routes**
app.use('/api', emergencyCampaigns);

// **Use additional features routes**
app.use('/api', addtionalFeatures);






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
