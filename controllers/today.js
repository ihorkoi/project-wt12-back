import Water from "../models/water.js";
import User from "../models/user.js";
import { HttpError, ctrlWrapper } from "../helpers/index.js";

const calculateWaterPercentage = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw HttpError(404, `User with id=${userId} not found`);
  }

  const dailyWaterRequirement = parseInt(user.dailyWaterRequirement);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const waterRecords = await Water.find({
    owner: userId,
    createdAt: { $gte: today },
  });

  const totalWaterConsumed = waterRecords.reduce(
    (total, record) => total + parseInt(record.waterAmount),
    0
  );

  const percentage = Math.round((totalWaterConsumed / dailyWaterRequirement) * 100);

  return { percentage, waterRecords };
};

const getWaterInfoForToday = async (req, res) => {
  const { _id: userId } = req.user;

  try {
    const result = await calculateWaterPercentage(userId);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export default {
  getWaterInfoForToday: ctrlWrapper(getWaterInfoForToday),
};