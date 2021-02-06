'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),

Schema = mongoose.Schema;

let customer = new Schema({
  custId: {
    type: String,
    default: '',
    index: true,
    unique: true
  },
  createdBy: {
    type: String,
    default: ''
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  middleName: {
    type: String,
    default: ''
  },
  Mother_name: {
    type: String,
    default: ''
  },
  Father_name: {
    type: String,
    default: ''
  },
  Spouse_name: {
    type: String,
    default: ''
  },
  Date_of_birth: {
    type: Date,
    default: ''
  },
  Gender: {
    type: String,
    default: ''
  },
  Category: {
    type: String,
    default: ''
  },
  Current_Address: {
    type: String,
    default: ''
  },
  C_City: {
    type: String,
    default: ''
  },
  C_Taluka: {
    type: String,
    default: ''
  },
  C_District: {
    type: String,
    default: ''
  },
  C_State: {
    type: String,
    default: ''
  },
  C_PinCode: {
    type: String,
    default: ''
  },
  Permanent_Address: {
    type: String,
    default: ''
  },
  P_City: {
    type: String,
    default: ''
  },
  P_Taluka: {
    type: String,
    default: ''
  },
  P_District: {
    type: String,
    default: ''
  },
  P_State: {
    type: String,
    default: ''
  },
  P_PinCode: {
    type: String,
    default: ''
  },
  Qualification: {
    type: String,
    default: ''
  },
  Mobile: {
    type: String,
    default: ''
  },
  Email: {
    type: String,
    default: ''
  },
  Passport: {
    type: String,
    default: ''
  },
  PAN: {
    type: String,
    default: ''
  },
  Aadhar: {
    type: String,
    default: ''
  },
  DL_No: {
    type: String,
    default: ''
  },
  C_KYC_No: {
    type: String,
    default: ''
  },
  Voter_ID: {
    type: String,
    default: ''
  }, 
  Period_of_stay: {
    type: String,
    default: ''
  }, 
  created_on: {
    type: Date,
    default: ''
  },
  modified_on: {
    type: Date,
    default: ''
  }
});

mongoose.model('customer', customer);