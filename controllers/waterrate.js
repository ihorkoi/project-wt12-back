import Water from "../models/water.js";

import { HttpError, ctrlWrapper } from "../helpers/index.js";

const addWater = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Water.create({ ...req.body, owner });

  res.status(201).json(result);
};

const editWater = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Water.findOneAndUpdate({ _id: id, owner }, req.body);
  if (!result) {
    throw HttpError(404, `Water with id=${id} not found`);
  }

  res.json(result);
};

const deleteWater = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Water.findOneAndDelete({ _id: id, owner });
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json({
    message: "Delete success",
  });
};

export default {
  addWater: ctrlWrapper(addWater),
  editWater: ctrlWrapper(editWater),
  deleteWater: ctrlWrapper(deleteWater),
};
