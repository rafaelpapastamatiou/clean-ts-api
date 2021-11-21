import { Router } from "express";

import { signupRoutes } from "../routes/singup.routes";

const routes = Router();

routes.use("/signup", signupRoutes);

export { routes };
