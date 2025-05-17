const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const Volunteer = require("../models/Volunteer");
const authController = require("../controllers/user.controller");
const Organization = require("../models/Organization");
require("dotenv").config();

let activeTokens = new Set();
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({
          error: "All fields (name, email, password, role) are required",
        });
    }
    console.log("Registering user:", { name, email, password, role }); // ✅ طباعة البيانات المدخلة في السيرفر
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword); // ✅ طباعة كلمة المرور المشفرة في السيرفر
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: error.message });

    try {
      const {
        name,
        email,
        password,
        role,
        full_name,
        phone_number,
        service_type,
        availability,
        address,
        contact_email,
      } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      if (role === "volunteer") {
        await Volunteer.create({
          user_id: newUser.id,
          full_name,
          phone_number,
          service_type,
          availability,
        });

        // 🔍 ابحث عن كل الطلبات اللي تحتاج نفس نوع الخدمة
        const matchingRequests = await Request.findAll({
          where: { service_needed: newVolunteer.service_type },
        });

        // 🧩 أنشئ تطابق بين هذا المتطوع وهذه الطلبات
        for (const request of matchingRequests) {
          await Match.create({
            volunteer_id: newVolunteer.id,
            request_id: request.id,
          });
        }
      } else if (role === "orphanage") {
        await Organization.create({
          user_id: newUser.id,
          name_orphanage: name,
          address,
          phone_number,
          contact_email,
        });
      }

      res.status(201).json({
        message: "User registered successfully",
        user: newUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error registering user" });
    }
  }
});

// ✅ تسجيل الدخول
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    activeTokens.add(token);

    res.json({ message: "Login successful", token }); // ← التوكن موجود في الـ response
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error logging in" });
  }
});

// ✅ تسجيل الخروج
router.post("/logout", authMiddleware, (req, res) => {
  const token = req.header("Authorization").split(" ")[1];
  res.json({ message: "Logged out successfully" });
});

// ✅ عرض الملف الشخصي
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching profile" });
  }
});

// ✅ تحديث الملف الشخصي
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Error updating profile" });
  }
});

// ✅ حذف الحساب
router.delete("/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.role !== "Admin" && req.user.id !== parseInt(userId)) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this account" });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.destroy();
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting account" });
  }
});

module.exports = router;
