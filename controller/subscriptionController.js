const asyncHandler = require("express-async-handler");
const Plan = require("../models/planModel");
const Subscription = require("../models/subscriptionModel");
const schedule = require("node-schedule");
const User = require("../models/userModel");

const createSubscription = asyncHandler(async (req, res) => {
  const { userDetails, planDetails } = req.body;

  const plan = await Plan.findById(planDetails);
  const user = await User.findById(userDetails);

  const expiry = new Date();
  expiry.setMonth(expiry.getMonth() + plan.duration);

  const subscription = await Subscription.create({
    plan,
    user,
    expiry,
    subscription_status: true
  });

  if (subscription) {
    user.subscriptionStatus = true;
    user.subscription = subscription._id;
    const updatedUser = await user.save();
    res.status(201).json(subscription);
  } else {
    res.status(400);
    throw new Error("Subscription not created");
  }
});

const subscriptionStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.query.userId);

  const subscription = await Subscription.find({ user: user._id }).populate(
    "plan",
    "id name price"
  );
  if (subscription) {
    res.json(subscription);
  } else {
    console.log("error");
  }
});
const allSubscription = asyncHandler(async (req, res) => {
 

  const subscription = await Subscription.find({}).populate(
    "plan user"
  );
  if (subscription) {
    res.json(subscription);
  } else {
    console.log("error");
  }
});

const renewSubscription = asyncHandler(async (req, res) => {
  const { userId, subscriptionId, planId } = req.body;

  const user = await User.findById(userId);
  const plan = await Plan.findById(planId);
  const subscription = await Subscription.findById(subscriptionId);

  const newexpiry = new Date();
  newexpiry.setMonth(subscription.expiry.getMonth() + 10);

  if (subscription && subscription.plan == planId) {
    subscription.plan = plan._id;
    subscription.user = user._id;
    subscription.expiry = newexpiry;
    subscription.subscription_status = true;

    const renewedSubscription = await subscription.save();

    if (renewedSubscription) {
      res.status(201).json({
        renewedSubscription,
      });
    } else {
      res.status(400);
      throw new Error("Renew error");
    }
  }
});

const endSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.find({}); // need to check how subscriptions are returned and check each subscription's date
  const today = new Date();

  for (let i = 0; i < subscription.length; i++) {
    const exp = subscription[i].expiry - today;

    if (exp <= 0) {
      const id = subscription[i]._id;
      const expuser = subscription[i].user;

      const user = await User.findOneAndUpdate(
        { _id: expuser },
        { subscriptionStatus: false }
      );

      const end = await Subscription.findOneAndUpdate(
        { _id: id },
        { subscription_status: false }
      );
    }
  }
});

const dailyJob = schedule.scheduleJob("0 15 0 * * *", function () {
  endSubscription();
});

const deleteSubscription = asyncHandler(async (req, res) => {
 const subscription = await Subscription.findById(req.query.id)
 if (subscription) {
  await User.findOneAndUpdate({_id: subscription.user}, {subscriptionStatus: false})
  await Subscription.deleteOne({_id: subscription._id})
  res.json("deleted")
 }
})

module.exports = {
  createSubscription,
  subscriptionStatus,
  renewSubscription,
  endSubscription,
  allSubscription,
  deleteSubscription
};
