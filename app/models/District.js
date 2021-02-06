'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let districtSchema = new Schema({
    id: {
        type: String
    },

    state_id: {
        type: String
    },

    name: {
        type: String
    }
});

mongoose.model('District', districtSchema);