'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let stateSchema = new Schema({
    id: {
        type: String
    },
    name:{
        type:String
    }
});

mongoose.model('State', stateSchema);