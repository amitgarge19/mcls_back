'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let PanSchema = new Schema({
    public_id: {
        type: String,
        default: ''
    },
    FranchiseeId: {
        type: String,
        default: ''
    },
    url: {
        type: String,
        default: ''
    }
});

mongoose.model('PAN', PanSchema);