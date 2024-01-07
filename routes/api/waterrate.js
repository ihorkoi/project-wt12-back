import express from "express";
import ctrl from "../../controllers/waterrate.js";
import {
  authenticate,
  isValidId,
  validateBody,
} from "../../middlewares/index.js";
import { addWaterSchema, waterEditSchema } from "../../models/water.js";

const waterRouter = express.Router();

waterRouter.use(authenticate);

waterRouter.post("/", validateBody(addWaterSchema), ctrl.addWater);

waterRouter.put("/:id", validateBody(waterEditSchema), ctrl.editWater);

waterRouter.delete("/:id", isValidId, ctrl.deleteWater);

export default waterRouter;
