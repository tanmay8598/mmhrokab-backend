const mongoose = require("mongoose");

const companySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  nameAr: {
    type: String,
    required: true,
  },
  nameBn: {
    type: String,
    required: true,
  },
  nameUr: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  companyCR: {
    type: String,
  },
  header: {
    type: String,
  },
  footer: {
    type: String,
  },
  stamp: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true
  },
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
