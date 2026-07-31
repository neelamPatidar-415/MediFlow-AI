const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
})

const userSchema = new mongoose.Schema({
  fullName: {
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
    select: false,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["patient", "hospital_admin", "admin"],
    default: "patient",  /// Rahul sharma -> hospital_admin, at hopital apollo . so fullname ,role and hospital name will be required for hospital admin too and patient will ignore hospital name
  },
  hospitalName: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  addresses: addressSchema,
},{
   timestamps: true
});

const userModel = mongoose.model('user',userSchema);

module.exports = userModel;