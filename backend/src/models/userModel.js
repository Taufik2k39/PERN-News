import pool from "../config/db.js";

export const createUser = async (username, email, passwordHash, image) => {
  const result = await pool.query(
    "INSERT INTO users (username, email, password, image) VALUES ($1, $2, $3, $4) RETURNING id, username, email",
    [username, email, passwordHash, image]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

export const findUserById = async (id) => {
  const result = await pool.query(
    "SELECT id, username, email, image, created_at FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

export const deleteUserById = async (id) => {
  const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);
  return result.rows[0];
};

export const updateUserById = async (id, username, email, image) => {
  const result = await pool.query(
    "UPDATE users SET username = $1, email = $2, image = COALESCE($3, image) WHERE id = $4 RETURNING id, username, email, image, created_at",
    [username, email, image, id]
  );
  return result.rows[0];
};
