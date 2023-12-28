import express from "express";
import ctrl from "../../controllers/contacts.js";
import {
  authenticate,
  isValidId,
  validateBody,
} from "../../middlewares/index.js";
import { addWaterSchema, waterEditSchema } from "../../models/water.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.post("/", validateBody(addWaterSchema), ctrl.addWater);

contactsRouter.put("/:id", validateBody(waterEditSchema), ctrl.editWater);

contactsRouter.delete("/:id", isValidId, ctrl.deleteWater);

export default contactsRouter;
