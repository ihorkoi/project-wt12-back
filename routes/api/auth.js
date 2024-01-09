import express from 'express';
import ctrl from "../../controllers/auth.js";
import { validateBody, authenticate, upload} from '../../middlewares/index.js';
import { registerSchema, loginSchema} from '../../models/user.js';


const authRouter = express.Router();

authRouter.post('/register', validateBody(registerSchema), ctrl.register)

authRouter.post('/login', validateBody(loginSchema), ctrl.login)

authRouter.get("/current", authenticate, ctrl.getCurrent)

authRouter.post("/logout", authenticate, ctrl.logout)

authRouter.patch("/", authenticate, ctrl.updateById);

authRouter.patch("/avatars", authenticate, upload.single("avatarURL"), ctrl.updateAvatar)

authRouter.patch("/update-water-norm", authenticate, ctrl.updateWaterNorm);

export default authRouter;