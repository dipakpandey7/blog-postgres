import { Post } from "../models/post.model";
import { Request, Response } from "express";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, category, featuredImage } = req.body;
    const authorId = (req.user as any).userId;

    const newPost = await Post.create({
      title,
      content,
      authorId,
      category,
      featuredImage,
    });
    res
      .status(201)
      .json({ message: "Post Create successfully", post: newPost });
  } catch (error) {
    console.error("Error creating post", error);

    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const getAllPost = async (req: Request, res: Response) => {
  try {
    const posts = await Post.findAll();
    res.json({ posts });
    console.log(posts);
  } catch (error) {
    console.error(" Error Fetching post ");
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("ID from req.params:", req.params.id);
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json("Post Not found");
    }
    res.status(200).json({ post });
    console.log("Fetch post successfully");
  } catch (error) {
    console.log("Something went wrong", error);
    res.status(500).json({ message: "Something went wrong, can't fetch post" });
  }
};
export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, category, featuredImage } = req.body;
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.authorId !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    await post.update({
      title,
      content,
      category,
      featuredImage,
      lastUpdate: new Date(),
    });

    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    console.error("Error updating post", error);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const post = await Post.findByPk(id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  if (post.authorId !== req.user.userId) {
    return res
      .status(403)
      .json({ message: "Not authorized to delete this post" });
  }
  await post.destroy();
  res.status(200).json({ message: "Post deleted successfully" });
};
