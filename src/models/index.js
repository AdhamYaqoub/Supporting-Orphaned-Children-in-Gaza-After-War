const sequelize = require('../config/database');
const User = require('./User');
const Orphan = require('./Orphan');
const Donation = require('./Donation');
const Sponsorship = require('./Sponsorship');
const Volunteer = require('./Volunteer');
const Organization = require('./Organization');
const EmergencyCampaign = require('./EmergencyCampaign');
const Transaction = require('./Transaction');
const Request = require('./Request');
const Review = require('./Review');

// (User)
User.hasMany(Donation, { foreignKey: 'user_id', as: 'userDonations' });
Donation.belongsTo(User, { foreignKey: 'user_id', as: 'donorUser' });

User.hasMany(Sponsorship, { foreignKey: 'donor_id', as: 'userSponsorships' });
Sponsorship.belongsTo(User, { foreignKey: 'donor_id', as: 'sponsoringUser' });

User.hasOne(Volunteer, { foreignKey: 'user_id', as: 'userVolunteerProfile' });
Volunteer.belongsTo(User, { foreignKey: 'user_id', as: 'volunteerProfileUser' });

User.hasMany(Review, { foreignKey: 'user_id', as: 'userReviews' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'reviewingUser' });

User.hasMany(Transaction, { foreignKey: 'user_id', as: 'userTransactions' });
Transaction.belongsTo(User, { foreignKey: 'user_id', as: 'transactionUser' });

// (Orphan)
Orphan.hasMany(Sponsorship, { foreignKey: 'orphan_id', as: 'orphanSponsorships' });
Sponsorship.belongsTo(Orphan, { foreignKey: 'orphan_id', as: 'sponsoredOrphan' });

Orphan.hasMany(Request, { foreignKey: 'orphan_id', as: 'orphanRequests' });
Request.belongsTo(Orphan, { foreignKey: 'orphan_id', as: 'requestingOrphan' });

// (Donation)
Donation.hasMany(Transaction, { foreignKey: 'donation_id', as: 'donationTransactions' });
Transaction.belongsTo(Donation, { foreignKey: 'donation_id', as: 'relatedDonation' });

Donation.belongsTo(EmergencyCampaign, { foreignKey: 'campaign_id', as: 'associatedCampaign' });
EmergencyCampaign.hasMany(Donation, { foreignKey: 'campaign_id', as: 'campaignDonations' });

Donation.belongsTo(Organization, { foreignKey: 'organization_id', as: 'associatedOrganization' });
Organization.hasMany(Donation, { foreignKey: 'organization_id', as: 'organizationDonations' });

// (Sponsorship)
Sponsorship.belongsTo(User, { foreignKey: 'donor_id', as: 'sponsorshipDonor' });
Sponsorship.belongsTo(Orphan, { foreignKey: 'orphan_id', as: 'sponsorshipOrphan' });

// (Volunteer)
Volunteer.belongsTo(User, { foreignKey: 'user_id', as: 'associatedUser' });

// (Organization)
Organization.hasMany(Request, { foreignKey: 'organization_id', as: 'organizationRequests' });
Request.belongsTo(Organization, { foreignKey: 'organization_id', as: 'requestingOrganization' });

Organization.hasMany(Review, { foreignKey: 'organization_id', as: 'organizationReviews' });
Review.belongsTo(Organization, { foreignKey: 'organization_id', as: 'reviewedOrganization' });

// Organization ↔ User
Organization.belongsTo(User, { foreignKey: 'user_id', as: 'organizationOwner' });
User.hasMany(Organization, { foreignKey: 'user_id', as: 'ownedOrganizations' });

// Organization ↔ Orphan
Organization.hasMany(Orphan, { foreignKey: 'organization_id', as: 'organizationOrphans' });
Orphan.belongsTo(Organization, { foreignKey: 'organization_id', as: 'orphanOrganization' });

// Organization ↔ EmergencyCampaign
Organization.hasMany(EmergencyCampaign, { foreignKey: 'organization_id', as: 'emergencyCampaigns' });
EmergencyCampaign.belongsTo(Organization, { foreignKey: 'organization_id', as: 'campaignOrganization' });


// (EmergencyCampaign)
EmergencyCampaign.hasMany(Donation, { foreignKey: 'campaign_id', as: 'emergencyCampaignDonations' });
Donation.belongsTo(EmergencyCampaign, { foreignKey: 'campaign_id', as: 'relatedEmergencyCampaign' });

module.exports = {
  sequelize,
  User,
  Orphan,
  Donation,
  Sponsorship,
  Volunteer,
  Organization,
  EmergencyCampaign,
  Transaction,
  Request,
  Review,
};
