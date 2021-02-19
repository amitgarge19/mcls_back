const adminController = require('../controllers/adminController')
const customerController = require('../controllers/customerController')
const appConfig = require('../../config/appConfig')
const auth = require('../middlewares/auth')

module.exports.setRouter = (app) => {

    let baseUrl = appConfig.apiVersion;

    // defining routes.

    app.post(`${baseUrl}/franchisee/all`, auth.isAuthorized, auth.whatUserType, adminController.getAllFranchisee);

    app.get(`${baseUrl}/franchisee/:FranchiseeId`, auth.isAuthorized, auth.whatUserType, adminController.getSingleFranchisee);

    app.get(`${baseUrl}/franchisee/:FranchiseeId/bank`, auth.isAuthorized, auth.whatUserType, adminController.getFranchiseeBankDetails);

    app.get(`${baseUrl}/franchisee/:FranchiseeId/office`, auth.isAuthorized, auth.whatUserType, adminController.getFranchiseeOfficeDetails);

    app.post(`${baseUrl}/get/customer/all`, auth.isAuthorized, auth.whatUserType, customerController.getAllCustomers);
}