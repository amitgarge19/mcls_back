'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),

    Schema = mongoose.Schema;

let CustInsuranceDetails = new Schema({
    custId: {
        type: String,
        default: '',
    },
    Policy_no: {
        type: String,
        default: '',
    },
    Policy_name: {
        type: String,
        default: ''
    },
    Issued_By: {
        type: String,
        default: '',
    },
    Maturity_date: {
        type: Date,
        default: '',
    },
    Policy_value: {
        type: Number,
        default: '',
    },
    Policy_Type: {
        type: String,
        default: '',
    },
    Premium: {
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

mongoose.model('CustInsuranceDetails', CustInsuranceDetails);