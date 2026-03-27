import pool from "../config/db.js";

export const createPost = async (title, content, userId) => {
  const result = await pool.query(
    "INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
    [title, content, userId]
  );
  return result.rows[0];
};

export const getPosts = async () => {
  const result = await pool.query("SELECT * FROM posts ORDER BY created_at DESC");
  return result.rows;
};

export const getPostById = async (id) => {
  const result = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
  return result.rows[0];
};

export const updatePost = async (id, title, content) => {
  const result = await pool.query(
    "UPDATE posts SET title=$1, content=$2 WHERE id=$3 RETURNING *",
    [title, content, id]
  );
  return result.rows[0];
};

export const deletePost = async (id) => {
  await pool.query("DELETE FROM posts WHERE id=$1", [id]);
};
