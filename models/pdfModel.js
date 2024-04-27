const mongoose = require("mongoose");

const pdfSchema = mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  pdf: {
    type: String,
  },
});

const Pdf = mongoose.model("Pdf", pdfSchema);

module.exports = Pdf;
