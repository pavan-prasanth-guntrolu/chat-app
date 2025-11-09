import express from "express";
import { loginUser, MyProfile, verifyUser } from "../controllers/user.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/verify", verifyUser);
router.get("/me", isAuth, MyProfile);

export default router;

// express.Router() creates a mini app to group related endpoints (users, auth, etc.).

// You mount that router on a base path with app.use('/api/v1', userRoutes).

// Every route you define inside the router is relative to that base path.
