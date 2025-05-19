🏠 Project Wiki: Orphan Support & Donation Management System
📌 Overview
The system's functions include managing orphan profiles, tracking donations, organizing emergency campaigns, matching volunteers, and guaranteeing openness between orphanages and donors. Developed using Node.js and Sequelize ORM, it has a modular RESTful API framework, real-time delivery assignment tracking, and support for both cash and in-kind donations.

⚙️ Technologies Used
Backend Framework: Node.js + Express.js

Database: Sequelize ORM with MySQL

Authentication: JWT-based token system

Email: Nodemailer with Gmail

Geolocation: OpenStreetMap Nominatim API

File Exporting: ExcelJS, PDFKit

Real-time: WebSocket for delivery tracking

Documentation: GitHub Wiki (this page)

🧱 System Architecture
Modular REST API structure

Middleware for:

Role-based access control

Authentication using JWT

Each major entity (User, Orphan, Donation, etc.) is separated into:

Model, Controller, Routes

Database sync with Sequelize and associations clearly defined

Exportable data for analysis/reporting

🔒 Roles supported: admin, donor, volunteer, orphanage

🗃️ Database Schema (Main Entities)
User: General user info with role

Organization: Orphanage details

Orphan: Orphan profile data

Sponsorship: Links orphans with donors

Donation: Monetary or item donations

Transaction: Payment and fee details

Volunteer: Registered volunteer data

VolunteerApplication: Application to assist

Request: Requests for specific services

EmergencyCampaign: Urgent campaigns for donations

DeliveryAssignment: Tracks delivery of physical donations

Review: Feedback from donors/volunteers

OrphanUpdate: Periodic updates for transparency

🌐 API URI Structure
Base path: /api/

Endpoint	Description	Role Access
/api/users/register	Register a new user	Public
/api/donations	Manage donations	Donor/Admin
/api/orphans	Orphan management	Orphanage/Admin
/api/sponsorships	Sponsorship actions	Donor
/api/requests	Volunteer service requests	Orphanage
/api/volunteers	Volunteer data	Admin/Orphanage
/api/campaigns	Emergency campaigns	Orphanage/Admin
/api/export/pdf / /xlsx	Export donations	Admin/Orphanage
/api/delivery/assign-volunteer	Assign delivery task	Orphanage

📖 System Features Breakdown
👶 Orphan Profiles & Sponsorships
Orphanage adds and manages orphans.

Donors can sponsor an orphan (financial/medical/educational).

Periodic updates (e.g., photos, health, education) are recorded.

💰 Donation Management
Monetary and in-kind donations supported.

In-kind donations require pickup address (geocoded).

Confirmation emails sent automatically.

👥 Volunteer & Service Matching
Orphanages post service needs.

Volunteers apply via applications.

Matching based on service_type.

✅ Trust & Transparency
Reviews from donors and volunteers.

Donor activity logs and statistics dashboard.

Orphan updates visible to sponsors.

🚨 Emergency Support Campaigns
Orphanage can start urgent campaigns.

Donors notified by email.

Status auto-updates once the target is reached.

🚚 Logistics & Distribution
Organizations assign volunteers to physical deliveries.

Track delivery status: assigned → in_progress → delivered.

Cancellations allowed by orphanage.

💼 Revenue & Sustainability Model
Platform takes a 5% fee from monetary donations.

Funds reinvested into platform sustainability and services.

🔗 External APIs Used
API	Purpose
OpenStreetMap Nominatim	Convert pickup address → coordinates
Nodemailer (Gmail)	Send confirmation and alert emails
PDFKit & ExcelJS	Export donations to files

📂 GitHub Repository Structure

/src
  /routes            ← All route definitions
  /controllers       ← Logic for each feature
  /models            ← Sequelize models
  /middleware        ← Auth and role verification
  /services          ← WebSocket, Delivery service
  /utils             ← Export helpers (PDF/Excel)
index.js             ← Entry point
.env                 ← Environment configs
README.md            ← Quick setup guide

📌 How to Run the System
Clone the repo:

git clone https://github.com/Mohammadbadawi01/Supporting-Orphaned-Children-in-Gaza-After-War.git
cd orphan-support-system

Install dependencies:

npm install

Set up .env file:

JWT_SECRET=your_secret
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
DB_HOST='localhost'
DB_USER='root'
DB_PASSWORD=your_password
DB_NAME=your_database_name

Run the server:

node index.js