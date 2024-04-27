
const express = require("express");

const { generatePdf, getPdf } = require("../controller/pdfController");


const router = express.Router();
router.route("/create").post(generatePdf);
router.route("/get").get(getPdf);


module.exports = router;