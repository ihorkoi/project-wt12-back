import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleMongooseError } from "../helpers/index.js";

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
  name: {
    type: String,
    reqired: [true, 'Name is required'],
  },
  email: {
    type: String,
    match: emailRegex,
    unique: true,
    reqired: [true, 'Email is required'],
  },
  password: {
    type: String,
    minLength: 6,
    maxLength: 64,
    reqired: [true, 'Set password for user']

  },
  token: {
    type: String,
    default: ""
  }

}, { versionKey: false, timestamps: true })

userSchema.post('save', handleMongooseError)

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).max(64).required(),
})

export const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).max(64).required()
})

const User = model("user", userSchema);

export default User;