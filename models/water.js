import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleMongooseError } from "../helpers/index.js";

const waterSchema = new Schema({
  waterAmount: {
    type: String,
    reqired: [true, "Water amount is required"],
  },
  time: {
    type: String,
    reqired: [true, "Time is required"],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

waterSchema.post("save", handleMongooseError);

export const addWaterSchema = Joi.object({
  waterAmount: Joi.string().required(),
  time: Joi.string().required(),
});

export const waterEditSchema = Joi.object({
  waterAmount: Joi.string(),
  time: Joi.string(),
});

const Water = model("water", waterSchema);

export default Water;
