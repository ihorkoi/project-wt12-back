import Water from "../models/water.js";
import User from "../models/user.js";


import { HttpError, ctrlWrapper } from "../helpers/index.js";

const getMonthWater = async (req, res) => {
  const { _id: owner } = req.user;

  const date = new Date(req.query.date)

  const currentYear = date.getFullYear()
  const currentMonth = date.getMonth()
  const nextMonth = date.getMonth() + 1

  const { dailyWaterRequirement } = await User.findOne(owner)
  const result = await Water.aggregate([
    { "$match": { owner, 'createdAt': { '$gt': new Date(currentYear, currentMonth), '$lt': new Date(currentYear, nextMonth) } } },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $group: {
        _id: { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" } },
        totalWaterAmount: {
          $sum: {
            $ifNull: [{ $toInt: "$waterAmount" }, 0],
          },
        },
        totalDailyNorm: { $first: "$dailyNorm" },
        recordsCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        dayNumber: "$_id.day",
        monthNumber: "$_id.month",
        totalWaterAmount: 1,
        recordsCount: 1,
        totalDailyNorm: 1,
        percent: {
          $round: [
            {
              $multiply: [
                { $divide: ["$totalWaterAmount", "$totalDailyNorm"] },
                100,
              ],
            },
            2
          ],
        },
      },
    },
  ])

  res.status(201).json(result);
};


const addWater = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Water.create({ ...req.body, owner });

  res.status(201).json(result);
};

const editWater = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Water.findOneAndUpdate({ _id: id, owner }, req.body, {
    new: true
  });
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
    id
  });
};

export default {
  addWater: ctrlWrapper(addWater),
  editWater: ctrlWrapper(editWater),
  deleteWater: ctrlWrapper(deleteWater),
  getMonthWater: ctrlWrapper(getMonthWater)
};
