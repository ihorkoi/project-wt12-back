import express from 'express';
import ctrl from "../../controllers/auth.js";
import { validateBody, authenticate, isValidId, upload} from '../../middlewares/index.js';
import { registerSchema, loginSchema, userUpdateName } from '../../models/user.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(registerSchema), ctrl.register)

authRouter.post('/login', validateBody(loginSchema), ctrl.login)

authRouter.get("/current", authenticate, ctrl.getCurrent)

authRouter.post("/logout", authenticate, ctrl.logout)

authRouter.patch("/:id/name", authenticate, isValidId, validateBody(userUpdateName), ctrl.updateById);

authRouter.patch("/avatars", authenticate, upload.single("avatarURL"), ctrl.updateAvatar)

export default authRouter;