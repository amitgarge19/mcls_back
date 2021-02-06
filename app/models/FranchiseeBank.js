'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),

    Schema = mongoose.Schema;

let franchiseeBank = new Schema({
    FranchiseeId: {
        type: String,
        default: ''
    },
    Account_Number: {
        type: String,
        default: ''
    },
    Bank_Name: {
        type: String,
        default: ''
    },    
    Account_Type: {
        type: String,
        default: ''
    },
    IFSC: {
        type: String,
        default: ''
    },
    Branch_Address: {
        type: String,
        default: ''
    },    
    Bank_City: {
        type: String,
        default: ''
    },
    Bank_Taluka: {
        type: String,
        default: ''
    },
    Bank_District: {
        type: String,
        default: ''
    },
    Bank_PinCode: {
        type: String,
        default: ''
    },
    Bank_State: {
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

mongoose.model('FranchiseeBank', franchiseeBank);
