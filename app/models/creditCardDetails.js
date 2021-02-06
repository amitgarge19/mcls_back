'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),

    Schema = mongoose.Schema;

let creditCardDetails = new Schema({
    custId: {
        type: String,
        default: '',
    },
    Credit_Card_no: {
        type: String,
        default: '',
    },
    Since: {
        type: Date,
        default: '',
    },
    Bank_name: {
        type: String,
        default: '',
    },
    Credit_Limit: {
        type: Number,
        default: 0,
    },
    Outstanding_Amount: {
        type: Number,
        default: 0,
    },
    Balance_Term: {
        type: Number,
        default: 0,
    },
    Balance_Outstanding: {
        type: Number,
        default: 0,
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

mongoose.model('CreditCardDetails', creditCardDetails);