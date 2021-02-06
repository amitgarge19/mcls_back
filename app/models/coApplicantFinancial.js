'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),

Schema = mongoose.Schema;

let coApplicantFinancial = new Schema({
    coApplicant_Id: {
        type: String,
        default: ''
    },
    Gross_monthly_income: {
        type: String,
        default: ''
    },
    Average_monthly_expenses: {
        type: String,
        default: ''
    },
    Assets_SB_Account: {
        type: String,
        default: ''
    },
    Immovable_Property: {
        type: String,
        default: ''
    },
    Current_balance_PF: {
        type: String,
        default: ''
    },
    Shares_Securities: {
        type: String,
        default: ''
    },
    Fixed_Deposits: {
        type: String,
        default: ''
    },
    Others_Assets: {
        type: String,
        default: ''
    },
    Total_Assets: {
        type: String,
        default: ''
    },

    Net_Monthly_Income: {
        type: String,
        default: ''
    },
    Credit_Society_Loan: {
        type: String,
        default: ''
    },
    Employer_Loan: {
        type: String,
        default: ''
    },
    Home_Loan: {
        type: String,
        default: ''
    },
    PF_Loan: {
        type: String,
        default: ''
    },
    Vehicle_Loan: {
        type: String,
        default: ''
    },
    Personal_Loan: {
        type: String,
        default: ''
    },
    Other_Liabilities: {
        type: String,
        default: ''
    },
    Total_Liabilities: {
        type: String,
        default: ''
    },
    created_On: {
        type: String,
        default: ''
    },
    modified_On: {
        type: String,
        default: ''
    }
})

mongoose.model('CoApplicantFinancial',coApplicantFinancial);