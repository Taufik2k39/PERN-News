import { createPost, getPosts, getPostById, updatePost, deletePost } from "../models/postModel.js";

const getPostErrorResponse = (error) => {
  const dbConnectionErrors = ["ECONNREFUSED", "ENOTFOUND", "28P01", "3D000"];

  if (dbConnectionErrors.includes(error?.code)) {
    return {
      status: 503,
      message: "Database tidak tersedia. Periksa konfigurasi backend DB.",
    };
  }

  if (error?.code === "42P01") {
    return {
      status: 500,
      message: "Schema posts belum siap.",
    };
  }

  return {
    status: 500,
    message: "Internal server error",
  };
};

export const create = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title dan content wajib diisi" });
    }

    const post = await createPost(title, content, req.user.id);
    return res.status(201).json(post);
  } catch (error) {
    console.error("Create post error:", error);
    const parsedError = getPostErrorResponse(error);
    return res.status(parsedError.status).json({ message: parsedError.message });
  }
};

export const index = async (req, res) => {
  try {
    const posts = await getPosts();
    return res.json(posts);
  } catch (error) {
    console.error("Get posts error:", error);
    const parsedError = getPostErrorResponse(error);
    return res.status(parsedError.status).json({ message: parsedError.message });
  }
};

export const show = async (req, res) => {
  try {
    const post = await getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.json(post);
  } catch (error) {
    console.error("Get post detail error:", error);
    const parsedError = getPostErrorResponse(error);
    return res.status(parsedError.status).json({ message: parsedError.message });
  }
};

export const edit = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title dan content wajib diisi" });
    }

    const post = await updatePost(req.params.id, title, content);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json(post);
  } catch (error) {
    console.error("Update post error:", error);
    const parsedError = getPostErrorResponse(error);
    return res.status(parsedError.status).json({ message: parsedError.message });
  }
};

export const remove = async (req, res) => {
  try {
    await deletePost(req.params.id);
    return res.json({ message: "Post deleted" });
  } catch (error) {
    console.error("Delete post error:", error);
    const parsedError = getPostErrorResponse(error);
    return res.status(parsedError.status).json({ message: parsedError.message });
  }
};
