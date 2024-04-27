const asyncHandler = require("express-async-handler");
const { generateTokenUser } = require("../utils/generateToken.js");
const User = require("../models/userModel.js");
const nodemailer = require("nodemailer");
// const emailTemplate = require("../document/email");

// @desc    Auth user & get token
// @route   POST /api/users/login
//@access   Public
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmail = asyncHandler(async (pass, user) => {
  transporter.sendMail({
    from: `Tawreed <info@tawreed.com>`, // sender address
    to: `${user.email}`, // list of receivers
    replyTo: `<info@tawreed.com>`,
    subject: `Password Reset Confirm ${user?.name}`, // Subject line
    text: `New Password`, // plain text body
    html: emailTemplate(pass, user), // html body
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    let pass = "";
    let str =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";

    for (let i = 1; i <= 8; i++) {
      let char = Math.floor(Math.random() * str.length + 1);

      pass += str.charAt(char);
    }
    user.password = pass;
    const updatedUser = await user.save();
    sendEmail(pass, user);
    res.status(201).json("success");
  } else {
    res.status(401);
    throw new Error("Invalid email");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      subscriptionStatus: user.subscriptionStatus,
      token: generateTokenUser(
        user._id,
        user.name,
        user.email,
        user.subscriptionStatus
      ),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    User registration
// @route   POST /api/users
//@access   Public

const photo = asyncHandler(async (req, res) => {
  const img = req.params.img;
  const vision = require("@google-cloud/vision");
  const client = new vision.ImageAnnotatorClient({
    keyFilename: "./mmhrokab-bd26a14478d1.json",
  });
  const parse = require("mrz").parse;

  //Google Cloud Vision Text Annotator (OCR)
  let sample1 = `./routes/uploads/${img}`;
  // let sample2 = "./samples/Passport2.png";

  //Extracting the mrz and preparing it for decoding
  const [result] = await client.textDetection(sample2);
  const texts = result.textAnnotations;
  let mainResult = texts[0].description;
  let mrzStartPosition = mainResult.indexOf("P<");
  let mrzText = mainResult.slice(mrzStartPosition);
  let textss = mrzText.replace(/\s/g, "");
  let line1 = textss.substring(0, 44);
  let line2 = textss.substring(44, 88);
  let mrzToDecode = `${line1}\n${line2}`;

  //MRZ Parser from https://www.npmjs.com/package/mrz
  let passportDetails = parse(mrzToDecode);
});

const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    nationality,
    dob,
    placeBirth,
    license,
    company,
  } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(404);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    nationality,
    dob,
    placeBirth,
    license,
    company,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      subscriptionStatus: user.subscriptionStatus,
      token: generateTokenUser(
        user._id,
        user.name,
        user.email,
        user.subscriptionStatus
      ),
    });
  } else {
    res.status(404);
    throw new Error("Invalid user data");
  }
});

// @desc    Get user profile
// @route   GET /api/users/login
//@access   Private

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      name: user.phone,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(201).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,

      token: generateTokenUser(
        updatedUser._id,
        updatedUser.name,
        updatedUser.email
      ),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   Get /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ subscriptionStatus: true });
  res.json(users);
});
const getBlockedUser = asyncHandler(async (req, res) => {
  const users = await User.find({ subscriptionStatus: false });
  res.json(users);
});

// @desc    Delete users
// @route   DELETE /api/users/:id
// @access  Private/Admin

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.query.id);
  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user by Id
// @route   GET /api/users/:id
// @access  Private/Admin

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.query.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
const approveUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.subscriptionStatus = true;

    const updatedUser = await user.save();
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
const blockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.subscriptionStatus = false;

    const updatedUser = await user.save();
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  resetPassword,
  photo,
  blockUser,
  approveUser,
  getBlockedUser,
};
