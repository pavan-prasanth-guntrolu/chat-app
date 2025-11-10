import express from "express";
import {
  getAllUsers,
  getUser,
  loginUser,
  MyProfile,
  updateName,
  verifyUser,
} from "../controllers/user.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/verify", verifyUser);
router.get("/me", isAuth, MyProfile);
router.post("/update/user", isAuth, updateName);
router.get("/user/all", isAuth, getAllUsers);
router.get("/user/:id", getUser);

export default router;

// express.Router() creates a mini app to group related endpoints (users, auth, etc.).

// You mount that router on a base path with app.use('/api/v1', userRoutes).

// Every route you define inside the router is relative to that base path.
