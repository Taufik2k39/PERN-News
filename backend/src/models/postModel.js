import pool from "../config/db.js";

export const createPost = async (title, content, image, userId) => {
  const result = await pool.query(
    "INSERT INTO posts (title, content, image, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [title, content, image, userId]
  );
  return result.rows[0];
};

export const getPosts = async () => {
  const result = await pool.query(
    `SELECT posts.*, users.username AS author_name
     FROM posts
     LEFT JOIN users ON posts.user_id = users.id
     ORDER BY posts.created_at DESC`
  );
  return result.rows;
};

export const getPostById = async (id) => {
  const result = await pool.query(
    `SELECT posts.*, users.username AS author_name
     FROM posts
     LEFT JOIN users ON posts.user_id = users.id
     WHERE posts.id = $1`,
    [id]
  );
  return result.rows[0];
};

export const updatePost = async (id, title, content, image) => {
  const result = await pool.query(
    "UPDATE posts SET title=$1, content=$2, image=COALESCE($3, image) WHERE id=$4 RETURNING *",
    [title, content, image, id]
  );
  return result.rows[0];
};

export const deletePost = async (id) => {
  await pool.query("DELETE FROM posts WHERE id=$1", [id]);
};
