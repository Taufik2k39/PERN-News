import jwt from "jsonwebtoken";
import {
  createUser,
  deleteUserById,
  findUserByEmail,
  findUserById,
  updateUserById,
} from "../models/userModel.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { getUploadedImagePath, toPublicImageUrl } from "../utils/image.js";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

const attachUserImageUrl = (req, user) => {
  if (!user) {
    return user;
  }

  return {
    ...user,
    image: toPublicImageUrl(req, user.image),
  };
};

const getAuthErrorResponse = (error, fallbackMessage) => {
  const dbConnectionErrors = ["ECONNREFUSED", "ENOTFOUND", "28P01", "3D000"];

  if (dbConnectionErrors.includes(error?.code)) {
    return {
      status: 503,
      message: "Database tidak tersedia. Periksa konfigurasi DB di backend.",
    };
  }

  if (error?.code === "42P01") {
    return {
      status: 500,
      message: "Schema database belum siap.",
    };
  }

  return {
    status: 500,
    message: fallbackMessage,
  };
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const image = getUploadedImagePath(req) ?? req.body?.image;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, dan password wajib diisi" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser(username, email, passwordHash, image);
    return res.status(201).json(attachUserImageUrl(req, user));
  } catch (error) {
    const parsedError = getAuthErrorResponse(error, "Failed to register user");
    console.error("Register error:", error);
    return res.status(parsedError.status).json({ message: parsedError.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    return res.json({ token });
  } catch (error) {
    const parsedError = getAuthErrorResponse(error, "Failed to login");
    console.error("Login error:", error);
    return res.status(parsedError.status).json({ message: parsedError.message });
  }
};

export const me = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(attachUserImageUrl(req, user));
  } catch (error) {
    const parsedError = getAuthErrorResponse(error, "Failed to fetch profile");
    console.error("Profile error:", error);
    return res.status(parsedError.status).json({ message: parsedError.message });
  }
};

export const removeMe = async (req, res) => {
  try {
    const deletedUser = await deleteUserById(req.user.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "Akun berhasil dihapus" });
  } catch (error) {
    const parsedError = getAuthErrorResponse(error, "Failed to delete profile");
    console.error("Delete profile error:", error);
    return res.status(parsedError.status).json({ message: parsedError.message });
  }
};

export const updateMe = async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ message: "Username dan email wajib diisi" });
    }

    const existingByEmail = await findUserByEmail(email);
    if (existingByEmail && Number(existingByEmail.id) !== Number(req.user.id)) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const image = getUploadedImagePath(req);
    const updatedUser = await updateUserById(req.user.id, username, email, image);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(attachUserImageUrl(req, updatedUser));
  } catch (error) {
    const parsedError = getAuthErrorResponse(error, "Failed to update profile");
    console.error("Update profile error:", error);
    return res.status(parsedError.status).json({ message: parsedError.message });
  }
};
