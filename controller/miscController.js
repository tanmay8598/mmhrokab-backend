const asyncHandler = require("express-async-handler");
const City = require("../models/cityModel");
const Company = require("../models/companyModel");
const User = require("../models/userModel");
const Subscription = require("../models/subscriptionModel");
const { endOfDay, startOfDay } = require("date-fns");

const createCity = asyncHandler(async (req, res) => {
  const { name, nameAr, nameBn, nameUr } = req.body;

  const plan = await City.create({
    name,
    nameAr,
    nameBn,
    nameUr,
  });

  if (plan) {
    res.status(201).json({
      plan,
    });
  } else {
    res.status(400);
    throw new Error("City not created");
  }
});

const getCities = asyncHandler(async (req, res) => {
  const plans = await City.find({});

  if (plans) {
    res.status(201).json(plans);
  } else {
    res.status(400);
    throw new Error("Cannot get Plans error");
  }
});

const deleteCities = asyncHandler(async (req, res) => {
  const PlanId = req.query.cityId;
  const plan = await City.findById(PlanId);

  if (plan) {
    await plan.remove();
    res.json({ message: "Plan removed" });
  } else {
    res.status(404);
    throw new Error("Plan not found");
  }
});

const getReport = asyncHandler(async (req, res) => {
  const today = new Date();
  const priorDate = new Date(new Date().setDate(today.getDate() + 10));
  const totalDriver = await User.countDocuments({});
  const totalSubscription = await Subscription.countDocuments({});
  const company = await Company.countDocuments({});
  const expiry = await Subscription.countDocuments({
    $and: [
      {
        expiry: {
          $gte: startOfDay(today),
          $lte: endOfDay(priorDate),
        },
      },
    ],
  });

  res.json({ expiry, totalDriver, totalSubscription, company });
});

module.exports = {
  createCity,
  deleteCities,
  getCities,
  getReport,
};
