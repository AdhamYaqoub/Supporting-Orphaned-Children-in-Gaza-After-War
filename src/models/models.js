const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    role: { type: DataTypes.ENUM('donor', 'admin', 'volunteer') },
    verified: { type: DataTypes.BOOLEAN, defaultValue: false }
});

const Orphan = sequelize.define('Orphan', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    health_condition: DataTypes.TEXT,
    education_status: DataTypes.STRING
});

const Donation = sequelize.define('Donation', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    amount: DataTypes.DECIMAL(10, 2),
    type: DataTypes.ENUM('money', 'clothes', 'food', 'education'),
    status: { type: DataTypes.ENUM('pending', 'completed', 'cancelled'), defaultValue: 'pending' }
});

const Volunteer = sequelize.define('Volunteer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    skills: DataTypes.STRING,
    availability: DataTypes.BOOLEAN
});

const Orphanage = sequelize.define('Orphanage', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    location: DataTypes.GEOMETRY('POINT'),
    verified: { type: DataTypes.BOOLEAN, defaultValue: false }
});

const Sponsorship = sequelize.define('Sponsorship', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE
});

const DonationCategory = sequelize.define('DonationCategory', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING
});

const EmergencyCampaign = sequelize.define('EmergencyCampaign', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: DataTypes.STRING,
    target_amount: DataTypes.DECIMAL(10, 2),
    deadline: DataTypes.DATE
});

const DonationTracking = sequelize.define('DonationTracking', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: DataTypes.STRING,
    update_date: DataTypes.DATE
});

const VolunteerOpportunity = sequelize.define('VolunteerOpportunity', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: DataTypes.STRING,
    description: DataTypes.TEXT
});

const VolunteerApplication = sequelize.define('VolunteerApplication', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: DataTypes.ENUM('pending', 'approved', 'rejected')
});

User.hasMany(Donation, { foreignKey: 'donor_id' });
Donation.belongsTo(User, { foreignKey: 'donor_id' });
User.hasMany(Sponsorship, { foreignKey: 'sponsor_id' });
Sponsorship.belongsTo(User, { foreignKey: 'sponsor_id' });
Orphan.hasMany(Sponsorship, { foreignKey: 'orphan_id' });
Sponsorship.belongsTo(Orphan, { foreignKey: 'orphan_id' });
Orphanage.hasMany(Orphan, { foreignKey: 'orphanage_id' });
Orphan.belongsTo(Orphanage, { foreignKey: 'orphanage_id' });
DonationCategory.hasMany(Donation, { foreignKey: 'category_id' });
Donation.belongsTo(DonationCategory, { foreignKey: 'category_id' });
EmergencyCampaign.hasMany(Donation, { foreignKey: 'campaign_id' });
Donation.belongsTo(EmergencyCampaign, { foreignKey: 'campaign_id' });
Donation.hasMany(DonationTracking, { foreignKey: 'donation_id' });
DonationTracking.belongsTo(Donation, { foreignKey: 'donation_id' });
Volunteer.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Volunteer, { foreignKey: 'user_id' });
VolunteerOpportunity.belongsTo(Orphanage, { foreignKey: 'orphanage_id' });
Orphanage.hasMany(VolunteerOpportunity, { foreignKey: 'orphanage_id' });
VolunteerApplication.belongsTo(Volunteer, { foreignKey: 'volunteer_id' });
Volunteer.hasMany(VolunteerApplication, { foreignKey: 'volunteer_id' });
VolunteerApplication.belongsTo(VolunteerOpportunity, { foreignKey: 'opportunity_id' });
VolunteerOpportunity.hasMany(VolunteerApplication, { foreignKey: 'opportunity_id' });