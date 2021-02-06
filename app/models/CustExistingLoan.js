'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),

    Schema = mongoose.Schema;

let custExistingLoans = new Schema({
    custId: {
        type: String,
        default: ''

    },
    Loan_ID: {
        type: String,
        default: ''

    },
    Name_of_Institution: {
        type: String,
        default: ''

    },
    Purpose_of_Loan: {
        type: String,
        default: ''

    },
    Disbursed_Loan_Amount: {
        type: String,
        default: ''

    },
    Emi: {
        type: String,
        default: ''

    },
    Balance_Term: {
        type: String,
        default: ''

    },
    Balance_Outstanding: {
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

mongoose.model('CustomerExistingLoans', custExistingLoans);