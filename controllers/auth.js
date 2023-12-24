import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from "../models/user.js";
import {HttpError, ctrlWrapper} from "../helpers/index.js"

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email already in use")
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ ...req.body, password: hashPassword });

    const payload = {
        id: newUser._id
    }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" })
    await User.findByIdAndUpdate(newUser._id, { token });

    res.status(201).json({
        token,
        email: newUser.email,
        name: newUser.name
    })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password invalid");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password invalid");
    }

    const payload = {
        id: user._id
    }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" })
    await User.findByIdAndUpdate(user._id, { token })
    res.json({
        token,
    })
}

const getCurrent = async (req, res) => {
    const { email, name } = req.user;
    res.json({
        email,
        name,
    })
}

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204).json({
        message: "Logout success"
    })
}

const updateSubscription = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, req.body, { new: true })
  
    res.json({
        message: "Update subscription success"
    })

}

export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription)
}
