import express from "express";
import ctrl from "../../controllers/today.js";
import { authenticate } from "../../middlewares/index.js";

const todayRouter = express.Router();

todayRouter.use(authenticate);

todayRouter.get("/", ctrl.getWaterInfoForToday);

export default todayRouter;