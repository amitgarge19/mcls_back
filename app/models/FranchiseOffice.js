'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),

  Schema = mongoose.Schema;

let franOfficeSchema = new Schema({
  FranchiseeId: {
    type: String,
    default: ''
  },
  franOffName: {
    type: String,
    default: ''
  },
  OffType: {
    type: String,
    default: ''
  },

  /*   lightBillPDF:{
      public_id: {
        type: String
      },
      url: {
        type: String
      }
    },
    shopActPDF:{
      public_id: {
        type: String
      },
      url: {
        type: String
      }
    },
    rentAgreementPDF:{
      public_id: {
        type: String
      },
      url: {
        type: String
      }
    },
   */
  OffNumber: {
    type: String,
    default: ''
  },
  OfficeAddress: {
    type: String,
    default: ''
  },
  Officecity: {
    type: String,
    default: 'Aurangabad'
  },
  Officetaluka: {
    type: String,
    default: ''
  },
  Officedistrict: {
    type: String,
    default: ''
  },
  OfficepinCode: {
    type: String,
    default: ''
  },
  OfficeState: {
    type: String,
    default: ''
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

mongoose.model('FranchiseeOffice', franOfficeSchema);