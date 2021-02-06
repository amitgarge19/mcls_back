'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),

  Schema = mongoose.Schema;

let franchiseeSchema = new Schema({
  FranchiseeId: {
    type: String,
    default: '',
    index: true,
    unique: true
  },
  userType: {
    type: String,
    default: 'Franchisee'
  },
  firstName: {
    type: String,
    default: ''
  },
  middleName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  dateOfBirth: {
    type: Date,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: ''
  },
  mobileNumber: {
    type: Number,
    default: 0
  },
  gender: {
    type: String,
    default: ''
  },
  pan: {
    type: String,
    default: ''
  },
  pan_pdf: {
    type: String,
    default: ''
  },
  aadhar: {
    type: String,
    default: ''
  },
  aadhar_pdf: {
    type: String,
    default: ''
  },
  homeAddress: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: 'Aurangabad'
  },
  taluka: {
    type: String,
    default: ''
  },
  district: {
    type: String,
    default: ''
  },
  pinCode: {
    type: String,
    default: ''
  },
  AddState: {
    type: String,
    default: ''
  },
  total_Leads_created: {
    type: Number,
    default: 0
  },
  total_Accepeted_leads: {
    type: Number,
    default: 0
  },
  total_Rejected_Leads: {
    type: Number,
    default: 0
  },
  total_Approved_Loan: {
    type: Number,
    default: 0
  },
  total_Rejected_Loans: {
    type: Number,
    default: 0
  },
  total_pending_Loans: {
    type: Number,
    default: 0
  },
  created_on: {
    type: Date,
    default: ""
  },
  modified_on: {
    type: Date,
    default: ''
  }
});

mongoose.model('Franchisee', franchiseeSchema);