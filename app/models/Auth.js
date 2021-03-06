const mongoose = require('mongoose'),
Schema = mongoose.Schema
const time = require('../libs/timeLib')

const Auth = new Schema({
    FranchiseeId: {
        type: String
    },
    authToken: {
        type: String
    },
    tokenSecret: {
        type: String
    },
    tokenGenerationTime: {
        type: Date,
        default: time.now()
    }
})

module.exports = mongoose.model('Auth', Auth)