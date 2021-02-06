'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),

Schema = mongoose.Schema;

let customerFinancial = new Schema({
    custId: {
        type: String,
        default: ''
    },
    Gross_monthly_income: {
        type: Number,
        default: ''
    },
    Average_monthly_expenses: {
        type: Number,
        default: ''
    },    
    Assets_SB_Account: {
        type: Number,
        default: ''
    },
    Immovable_Property: {
        type: Number,
        default: ''
    },
    Current_balance_PF: {
        type: Number,
        default: ''
    },
    Shares_Securities: {
        type: Number,
        default: ''
    },
    Fixed_Deposits: {
        type: Number,
        default: ''
    },
    Others_Assets: {
        type: Number,
        default: ''
    },
    Total_Assets: {
        type: Number,
        default: ''
    },
    Net_Monthly_Income: {
        type: Number,
        default: ''
    },
    Credit_Society_Loan: {
        type: Number,
        default: ''
    },
    Employer_Loan: {
        type: Number,
        default: ''
    },
    Home_Loan: {
        type: Number,
        default: ''
    },
    PF_Loan: {
        type: Number,
        default: ''
    },
    Vehicle_Loan: {
        type: Number,
        default: ''
    },
    Personal_Loan: {
        type: Number,
        default: ''
    },
    Other_Liabilities: {
        type: Number,
        default: ''
    },
    Total_Liabilities: {
        type: Number,
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
})

mongoose.model('CustomerFinancial',customerFinancial);