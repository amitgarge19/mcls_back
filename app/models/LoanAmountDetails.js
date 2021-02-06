'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),

    Schema = mongoose.Schema;

let LoanAmountDetails = new Schema({
    custId: {
        type: String,
        default: '',
    },
    Loan_Id: {
        type: String,
        default: '',
    },
    Land_cost: {
        type: Number,
        default: '',
    },
    Agreement_value: {
        type: Number,
        default: '',
    },
    Amenities_agreement: {
        type: Number,
        default: '',
    },
    Stamp_Duty_Reg_Charge: {
        type: Number,
        default: '',
    },
    Cost_of_Construction_Ext_Imp: {
        type: Number,
        default: '',
    },
    Incidental: {
        type: Number,
        default: '',
    },
    Total_Requirement_funds: {
        type: Number,
        default: '',
    },
    Amount_spent: {
        type: Number,
        default: '',
    },
    Balance_fund: {
        type: Number,
        default: '',
    },
    Savings: {
        type: Number,
        default: '',
    },
    Disposal_of_asset: {
        type: Number,
        default: '',
    },
    Family: {
        type: Number,
        default: '',
    },
    Others: {
        type: Number,
        default: '',
    },
    Total_balance_fund: {
        type: Number,
        default: '',
    },
    Loan_requirement: {
        type: Number,
        default: '',
    },
    Total_source_of_funds: {
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

mongoose.model('LoanAmountDetails', LoanAmountDetails);