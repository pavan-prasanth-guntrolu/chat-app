import express from "express";

const router = express.Router();

export default router;

// express.Router() creates a mini app to group related endpoints (users, auth, etc.).

// You mount that router on a base path with app.use('/api/v1', userRoutes).

// Every route you define inside the router is relative to that base path.
