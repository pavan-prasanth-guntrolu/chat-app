import express from "express";
import { loginUser } from "../controllers/user.js";

const router = express.Router();

router.post("/login", loginUser);

export default router;

// express.Router() creates a mini app to group related endpoints (users, auth, etc.).

// You mount that router on a base path with app.use('/api/v1', userRoutes).

// Every route you define inside the router is relative to that base path.
