import { Router } from "express";
import { createPost, deletePost, getAllPost, getPostById, updatePost } from "../controllers/post.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router=Router();

router.post("/createPost", authMiddleware,createPost);
router.get("/getAllPosts",getAllPost);
router.get("/post/:id",getPostById);
router.put("/posts/:id", authMiddleware, updatePost);
router.delete("/posts/:id",authMiddleware,deletePost);


export default router;