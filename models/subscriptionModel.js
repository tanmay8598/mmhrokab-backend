const mongoose = require("mongoose");

const subscriptionSchema = mongoose.Schema({
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Plan",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  expiry: {
    type: Date,
    required: true,
  },
  subscription_status: {
    type: Boolean,
    required: true,
  },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
