'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),

    Schema = mongoose.Schema;

let CustBankDetails = new Schema({
    custId: {
        type: String,
        default: '',
    },
    Bank_Name: {
        type: String,
        default: '',
    },
    Branch: {
        type: String,
        default: '',
    },

    IFSC: {
        type: String,
        default: ''
    },

    ACC_Type: {
        type: String,
        default: '',
    },
    Account_No: {
        type: String,
        default: '',
    },
    Opening_Date: {
        type: Date,
        default: '',
    },
    Balance: {
        type: Number,
        default: '',
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

mongoose.model('CustBankDetails', CustBankDetails);