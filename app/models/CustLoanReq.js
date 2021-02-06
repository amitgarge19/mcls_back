'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),

    Schema = mongoose.Schema;

let CustLoanReq = new Schema({
    custId: {
        type: String,
        default: ''
    },
    Loan_Id: {
        type: String,
        default: ''
    },
    Purpose_of_Loan: {
        type: String,
        default: ''
    },
    Loan_Amount: {
        type: Number,
        default: ''
    },
    Loan_Tenure: {
        type: Number,
        default: ''
    },
    Interest_Option: {
        type: String,
        default: ''
    },
    Payment_Method: {
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

mongoose.model('CustLoanReq', CustLoanReq);