'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),

    Schema = mongoose.Schema;

let customerOccupation = new Schema({
    custId: {
        type: String,
        default: ''
    },
    Occupational_Category: {
        type: String,
        default: ''
    },
    Employer_Business_Name: {
        type: String,
        default: ''
    },
    Address: {
        type: String,
        default: ''
    },
    City: {
        type: String,
        default: ''
    },
    Taluka: {
        type: String,
        default: ''
    },
    District: {
        type: String,
        default: ''
    },
    State: {
        type: String,
        default: ''
    },
    PinCode: {
        type: String,
        default: ''
    },    
    Phone_No: {
        type: String,
        default: ''
    },
    Employer_Business_Type: {
        type: String,
        default: ''
    },
    Legal_Status: {
        type: String,
        default: ''
    },
    Designation: {
        type: String,
        default: ''
    },
    Department: {
        type: String,
        default: ''
    },
    Employee_Code: {
        type: String,
        default: ''
    },
    Date_of_Joining_Commencement: {
        type: Date,
        default: ''
    },
    Total_work_experience: {
        type: String,
        default: ''
    },
    GSTIN: {
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

mongoose.model('CustomerOccupation', customerOccupation);