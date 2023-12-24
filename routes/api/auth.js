import express from 'express';
import ctrl from "../../controllers/auth.js";
import { validateBody, authenticate } from '../../middlewares/index.js';
import {registerSchema, loginSchema} from '../../models/user.js'

const authRouter = express.Router();

authRouter.post('/register', validateBody(registerSchema), ctrl.register)

authRouter.post('/login', validateBody(loginSchema), ctrl.login)

authRouter.get("/current", authenticate, ctrl.getCurrent)

authRouter.post("/logout", authenticate, ctrl.logout)

// router.patch("/users", authenticate, validateBody(schemas.updateSubscriptionSchema), ctrl.updateSubscription)

export default authRouter;