
const express = require("express");
const { createPlan, updatePlan, getPlans, getPlanById, deletePlan } = require("../controller/planController");


const router = express.Router();
router.route("/create").post(createPlan);
router.route("/get").get(getPlans);
router.route("/getById").get(getPlanById);
router.route("/update").post(updatePlan);
router.route("/delete").delete(deletePlan);

module.exports = router;