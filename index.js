const express = require("express");
const app = express();
const dashboardRoutes = require("./src/routes/dashboard.routes");
const authRoutes = require("./src/routes/auth.routes");
const usersRoutes = require("./src/routes/user.routes");
const notificationsRoutes = require("./src/routes/notifications.routes");

app.use(express.json());

// إضافة المسارات
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationsRoutes);

// الاستماع على المنفذ
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
