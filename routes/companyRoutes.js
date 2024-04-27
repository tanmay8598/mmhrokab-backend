
const express = require("express");
const { createCompany, getcompanies, getCompanyById, updateCompany, deleteCompany } = require("../controller/companyController");


const router = express.Router();
router.route("/create").post(createCompany);
router.route("/get").get(getcompanies);
router.route("/getById").get(getCompanyById);
router.route("/renew").post(updateCompany);
router.route("/delete").delete(deleteCompany);

module.exports = router;