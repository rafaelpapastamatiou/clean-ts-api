import { Router } from "express";

const signupRoutes = Router();

signupRoutes.post("/", (req, res) => {
  return res.json({
    ok: true,
  });
});

export { signupRoutes };
