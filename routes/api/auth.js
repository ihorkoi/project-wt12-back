import express from 'express';
import ctrl from "../../controllers/auth.js";
import { validateBody, authenticate, isValidId} from '../../middlewares/index.js';
import { registerSchema, loginSchema, userUpdateName } from '../../models/user.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(registerSchema), ctrl.register)

authRouter.post('/login', validateBody(loginSchema), ctrl.login)

authRouter.get("/current", authenticate, ctrl.getCurrent)

authRouter.post("/logout", authenticate, ctrl.logout)

authRouter.patch("/:id/name", authenticate, isValidId, validateBody(userUpdateName), ctrl.updateById);

export default authRouter;