const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },  
    nationality: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    placeBirth: {
      type: String,
      required: true,
    },
    license: {
      type: String,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
    subscriptionStatus: {
      type: Boolean,
      required: true,
      default: false,
    },
    pushToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bycrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bycrypt.genSalt(10);
  this.password = await bycrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
