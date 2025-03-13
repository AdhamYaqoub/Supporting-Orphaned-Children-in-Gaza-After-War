// const pool = require("./db");

// const initDB = async () => {
//   try {
//     console.log("🚀 Initializing database...");

//     // 🟢 جدول المستخدمين
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS Users (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         email VARCHAR(255) UNIQUE NOT NULL,
//         password VARCHAR(255) NOT NULL,
//         role ENUM('donor', 'volunteer', 'admin') NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `);

//     // 🟢 جدول الأيتام
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS Orphans (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         age INT NOT NULL,
//         education_status VARCHAR(255),
//         health_condition TEXT,
//         orphanage_name VARCHAR(255),
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `);

//     // 🟢 جدول الجمعيات الخيرية
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS Organizations (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         address VARCHAR(255),
//         contact_email VARCHAR(255),
//         verified BOOLEAN DEFAULT FALSE,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `);

//     // 🟢 جدول التبرعات
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS Donations (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         user_id INT NOT NULL,
//         amount DECIMAL(10,2) NOT NULL,
//         category ENUM('general', 'education', 'medical') NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
//       );
//     `);

//     // 🟢 جدول الرعاية (ربط المتبرع باليتيم)
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS Sponsorships (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         donor_id INT NOT NULL,
//         orphan_id INT NOT NULL,
//         monthly_amount DECIMAL(10,2) NOT NULL,
//         start_date DATE NOT NULL,
//         end_date DATE DEFAULT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (donor_id) REFERENCES Users(id) ON DELETE CASCADE,
//         FOREIGN KEY (orphan_id) REFERENCES Orphans(id) ON DELETE CASCADE
//       );
//     `);

//     // 🟢 جدول المتطوعين
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS Volunteers (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         user_id INT NOT NULL,
//         service_type ENUM('teaching', 'mentoring', 'healthcare') NOT NULL,
//         availability TEXT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
//       );
//     `);

//     // 🟢 جدول الحملات الطارئة
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS Emergency_Campaigns (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         title VARCHAR(255) NOT NULL,
//         description TEXT NOT NULL,
//         target_amount DECIMAL(10,2) NOT NULL,
//         collected_amount DECIMAL(10,2) DEFAULT 0,
//         status ENUM('active', 'completed') DEFAULT 'active',
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `);

//     // 🟢 جدول المعاملات المالية
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS Transactions (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         user_id INT NOT NULL,
//         amount DECIMAL(10,2) NOT NULL,
//         transaction_type ENUM('donation', 'sponsorship', 'campaign') NOT NULL,
//         status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
//       );
//     `);

//     // 🟢 جدول الطلبات من الجمعيات الخيرية
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS Requests (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         orphanage_name VARCHAR(100),
//         service_needed VARCHAR(255),
//         status ENUM('pending', 'matched', 'completed'),
//         requested_date DATE
//       );
//     `);

//     // 🟢 جدول التقييمات
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS Reviews (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         user_id INT,
//         orphanage_name VARCHAR(100),
//         rating INT,
//         feedback TEXT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
//       );
//     `);

//     console.log("✅ All tables created successfully!");

//   } catch (error) {
//     console.error("❌ Error creating tables:", error);
//   }
// };

// initDB();
