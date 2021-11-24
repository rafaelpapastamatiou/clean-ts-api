import { Router } from "express";

import { adaptExpressRoute } from "../adapters/express-route.adapter";
import { makeSignUpController } from "../factories/signup/signup.factory";

const signupRoutes = Router();

signupRoutes.post("/", adaptExpressRoute(makeSignUpController()));

export { signupRoutes };
