const express = require("express");
const {
  createCity,
  getCities,
  deleteCities,
  getReport,
} = require("../controller/miscController");

const router = express.Router();
router.route("/create").post(createCity);
router.route("/get").get(getCities);
router.route("/end").delete(deleteCities);
router.route("/reports").get(getReport);
module.exports = router;
