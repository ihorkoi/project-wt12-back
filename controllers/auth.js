import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises'

import User from "../models/user.js";
import {HttpError, ctrlWrapper, cloudinary} from "../helpers/index.js"

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
        name: newUser.email.split('@')[0],
        gender: newUser.gender,
        dailyWaterRequirement: newUser.dailyWaterRequirement,
        avatarURL: newUser.avatarURL,
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
        email: user.email,
        name: user.name,
        gender: user.gender,
        dailyWaterRequirement: user.dailyWaterRequirement,
        avatarURL: user.avatarURL
    })
}

const getCurrent = async (req, res) => {
    const { _id, email, name, gender, dailyWaterRequirement, avatarURL } = req.user;
    
    res.json({
        _id,
        email,
        name,
        gender,
        dailyWaterRequirement,
        avatarURL,
    })
}

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204).json({
        message: "Logout success"
    })
}

const updateById = async (req, res) => {
    const { _id } = req.user;
    const result = await User.findByIdAndUpdate(_id, req.body);
    if (!result) {
        throw HttpError(404, `User with id=${_id} not found`)
    }

    res.json(result);
}

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const {url: avatarURL} = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
    });
    await fs.unlink(req.file.path);

    const result = await User.findByIdAndUpdate(_id, { avatarURL });
    
    if (!result) {
        throw HttpError(404, 'Not found')
    }

    res.json({
        avatarURL
    })
}

export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateById: ctrlWrapper(updateById),
    updateAvatar: ctrlWrapper(updateAvatar)
}
