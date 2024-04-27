const express = require("express");
const {
  photo,
  registerUser,
  getUsers,
  authUser,
  getBlockedUser,
  getUserById,
} = require("../controller/userController");

const router = express.Router();
router.route("/").post(registerUser).get(getUsers);
router.post("/login", authUser);
router.get("/blocked", getBlockedUser);
router.route("/scan").get(photo);
router.route("/getById").get(getUserById);
module.exports = router;
