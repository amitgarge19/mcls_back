'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let CustProPictureSchema = new Schema({   
    public_id: {
        type: String,
        default: ''
    },
    CustID: {
        type: String,
        default: ''
    },
    url: {
        type: String,
        default: ''
    }
});

mongoose.model('CustProfilePicture', CustProPictureSchema);