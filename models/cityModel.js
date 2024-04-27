const mongoose = require("mongoose");

const citySchema = mongoose.Schema({
  
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
});

const City = mongoose.model("City", citySchema);

module.exports = City;
