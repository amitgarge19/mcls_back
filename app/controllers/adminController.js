const mongoose = require('mongoose');
const response = require('../libs/responseLib')
const logger = require('../libs/loggerLib');
const check = require('../libs/checkLib');

/* Models */
const FranchiseeModel = mongoose.model('Franchisee')
const FranchiseeBankModel = mongoose.model('FranchiseeBank')
const FranchiseeOfficeModel = mongoose.model('FranchiseeOffice')

let getAllFranchisee = (req, res) => {
    FranchiseeModel.find({ 'userType': { $ne: 'SuperUser' } })
        .select(' -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Admin Controller: getAllFranchisee', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Franchisee Found', 'Admin Controller: getAllFranchisee')
                let apiResponse = response.generate(true, 'No Franchisee Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All Franchisee Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}

/* Get single Franchisee details */
let getSingleFranchisee = (req, res) => {
    FranchiseeModel.findOne({ 'FranchiseeId': req.params.FranchiseeId })
        .select('-password -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Admin Controller: getSingleFranchisee', 10)
                let apiResponse = response.generate(true, 'Failed to find the Franchisee Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Franchisee Found', 'Admin Controller:getSingleFranchisee')
                let apiResponse = response.generate(true, 'No Franchisee Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'Franchisee Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get Franchisee user

let getFranchiseeBankDetails = (req, res) => {
    FranchiseeBankModel.find({ 'FranchiseeId': req.params.FranchiseeId })
        .select('-__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Admin Controller: getFranchiseeBankDetails', 10)
                let apiResponse = response.generate(true, 'Failed To Find Franchisee Bank Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Franchisee Bank Details Found', 'Admin Controller:getFranchiseeBankDetails')
                let apiResponse = response.generate(true, 'No Franchisee Bank details Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'Franchisee Bank Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}

let getFranchiseeOfficeDetails = (req, res) => {
    FranchiseeOfficeModel.find({ 'FranchiseeId': req.params.FranchiseeId })
        .select('-__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Admin Controller: getFranchiseeOfficeDetails', 10)
                let apiResponse = response.generate(true, 'Failed To Find Franchisee Office Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Franchisee Office Details Found', 'Admin Controller:getFranchiseeOfficeDetails')
                let apiResponse = response.generate(true, 'No Franchisee Office details Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'Franchisee Office Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}

module.exports = {
    getAllFranchisee: getAllFranchisee,
    getSingleFranchisee: getSingleFranchisee,
    getFranchiseeBankDetails: getFranchiseeBankDetails,
    getFranchiseeOfficeDetails: getFranchiseeOfficeDetails
}