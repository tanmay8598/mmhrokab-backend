const asyncHandler = require("express-async-handler");
const Plan = require("../models/planModel");


const createPlan = asyncHandler(async (req, res) => {
  const { name, price, duration } = req.body;

  const plan = await Plan.create({
    name,
    price,
    duration,
  });

  if (plan) {
    res.status(201).json({
      plan,
    });
  } else {
    res.status(400);
    throw new Error("Plan not created");
  }
});

const updatePlan = asyncHandler(async (req, res) => {
  const { name, price, duration, planId } =
    req.body;

  const plan = await Plan.findById(planId);

  if (plan) {
    plan.name = name;
    plan.price = price;
    plan.duration = duration;
   

    const updatedplan = await plan.save();

    res.status(201).json(updatedplan);
  } else {
    res.status(400);
    throw new Error("Plan not created");
  }
});

const getPlans = asyncHandler(async (req, res) => {
  const plans = await Plan.find({});

  if (plans) {
    res.status(201).json(plans);
  } else {
    res.status(400);
    throw new Error("Cannot get Plans error");
  }
});



const deletePlan = asyncHandler(async (req, res) => {
  // console.log("hi");
  const PlanId = req.query.planId;
  const plan = await Plan.findById(PlanId);

  if (plan) {
    await plan.remove();
    res.json({ message: "Plan removed" });
  } else {
    res.status(404);
    throw new Error("Plan not found");
  }
});

const getPlanById = asyncHandler(async (req, res) => {
  const plan = await Plan.findById(req.params.id);

  if (plan) {
    res.json(plan);
  } else {
    res.status(404);
    throw new Error("Plan not found");
  }
});

module.exports = {
  createPlan,
  updatePlan,
  getPlans,
  deletePlan,
  getPlanById,
};
