'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),

    Schema = mongoose.Schema;

let CustPropertyDetails = new Schema({
    custId: {
        type: String,
        default: '',
    },    
    Address: {
        type: String,
        default: '',
    },
    City: {
        type: String,
        default: '',
    },
    Taluka: {
        type: String,
        default: '',
    },
    District: {
        type: String,
        default: '',
    },
    State: {
        type: String,
        default: '',
    },
    Pin_code: {
        type: String,
        default: '',
    },
    Land_mark: {
        type: String,
        default: '',
    },
    Property_Type: {
        type: String,
        default: '',
    },
    Land_Area: {
        type: String,
        default: '',
    },
    Built_up_area: {
        type: String,
        default: '',
    },
    Ownership_type: {
        type: String,
        default: '',
    },
    Land_type: {
        type: String,
        default: '',
    },
    Construction_stage: {
        type: String,
        default: '',
    },
    ConstructionStagePercent: {
        type: Number,
        default: '',
    },
    Approx_value: {
        type: Number,
        default: '',
    },
    created_on: {
        type: Date,
        dafault: ''
    },
    modified_on: {
        type: Date,
        default: ''
    }
});

mongoose.model('CustPropertyDetails', CustPropertyDetails);