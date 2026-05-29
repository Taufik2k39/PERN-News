import express from "express";
import cors from "cors";
import { login, me, register, removeMe, updateMe } from "./src/controllers/authController.js";
import { authenticate } from "./src/middleware/authMiddleware.js";
import { create, edit, index, remove, show } from "./src/controllers/postController.js";
import { initializeDatabase } from "./src/config/db.js";
import { uploadImage } from "./src/middleware/uploadMiddleware.js";

const app = express();
const PORT = 5000;
const API_PREFIX = "/api";
let isDatabaseReady = false;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Middleware untuk parsing JSON
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get(`${API_PREFIX}/health`, (_req, res) => {
  res.status(isDatabaseReady ? 200 : 503).json({
    status: isDatabaseReady ? "ok" : "degraded",
    database: isDatabaseReady ? "connected" : "disconnected",
  });
});

app.use(`${API_PREFIX}`, (req, res, next) => {
  if (req.path === "/health") {
    return next();
  }

  if (!isDatabaseReady) {
    return res.status(503).json({ message: "Database tidak tersedia. Periksa konfigurasi backend DB." });
  }

  return next();
});

// Routing Auth
app.post(`${API_PREFIX}/auth/register`, uploadImage.single("image"), register);
app.post(`${API_PREFIX}/auth/login`, login);
app.get(`${API_PREFIX}/auth/me`, authenticate, me);
app.put(`${API_PREFIX}/auth/me`, authenticate, uploadImage.single("image"), updateMe);
app.delete(`${API_PREFIX}/auth/me`, authenticate, removeMe);

// Routing Posts
app.post(`${API_PREFIX}/posts`, authenticate, uploadImage.single("image"), create);
app.get(`${API_PREFIX}/posts`, index);
app.get(`${API_PREFIX}/posts/:id`, show);
app.put(`${API_PREFIX}/posts/:id`, authenticate, uploadImage.single("image"), edit);
app.delete(`${API_PREFIX}/posts/:id`, authenticate, remove);

app.use((err, _req, res, _next) => {
  if (err?.name === "MulterError") {
    return res.status(400).json({ message: `Upload gagal: ${err.message}` });
  }

  if (err?.message === "File harus berupa gambar.") {
    return res.status(400).json({ message: err.message });
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

const startServer = async () => {
  try {
    await initializeDatabase();
    isDatabaseReady = true;
  } catch (error) {
    isDatabaseReady = false;
    console.error("Database initialization failed:", error.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
