# 🕊️ HopeConnect - Backend API

HopeConnect is a humanitarian platform built to support and manage orphaned children in Gaza after the war. The backend API provides robust features for managing donations, emergency campaigns, user roles (admin, donor, organization), search functionality, and export to Excel/PDF.

## 📦 Tech Stack

- **Backend Framework:** Node.js (v22.14.0)
- **Web Framework:** Express.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **Export Tools:** exceljs, pdfkit
- **Other Libraries:** dotenv, cors, morgan, multer, http, ws, bcrypt

---

## 🚀 Getting Started

### 🔧 Prerequisites

- [Node.js](https://nodejs.org/) **v22.14.0**
- [MySQL Server](https://www.mysql.com/) running locally or on a cloud host

### 📥 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Mohammadbadawi01/Supporting-Orphaned-Children-in-Gaza-After-War.git
   cd hopeconnect-backend

---

## Install the required packages:
 ### npm install

 ---

## Create a .env file in the root directory and add the following environment variables:
  ### PORT=3000
  ### DB_HOST=localhost
  ### DB_USER=root
  ### DB_PASSWORD=yourpassword
  ### DB_NAME=hopeconnect
  ### JWT_SECRET=your_jwt_secret
  ### EMAIL=your_email
  ### EMAIL_PASSWORD= your_EMAIL_PASSWORD

  ---

## Start the server:
 ### node ./index.js
