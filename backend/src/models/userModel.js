import pool from "../config/db.js";

export const createUser = async (username, email, passwordHash) => {
  const result = await pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
    [username, email, passwordHash]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

export const findUserById = async (id) => {
  const result = await pool.query(
    "SELECT id, username, email, created_at FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

export const deleteUserById = async (id) => {
  const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);
  return result.rows[0];
};

export const updateUserById = async (id, username, email) => {
  const result = await pool.query(
    "UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email, created_at",
    [username, email, id]
  );
  return result.rows[0];
};
