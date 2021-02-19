const express = require('express');
const franchiseeController = require('../controllers/franchiseeController');
const customerController = require('../controllers/customerController');
const appConfig = require('../../config/appConfig');
const parser = require('../middlewares/cloudinary');
const auth = require('../middlewares/auth');

module.exports.setRouter = (app) => {

    let baseUrl = appConfig.apiVersion;

    // defining routes.

    // params: firstName, lastName, email, mobileNumber, password
    app.post(`${baseUrl}/signup`, franchiseeController.signUpFunction);

    app.post(`${baseUrl}/get/franchisee`, franchiseeController.getFranchiseeById);

    app.put(`${baseUrl}/FranAdditional`, auth.isAuthorized, franchiseeController.franchAdditionalDetails);

    app.post(`${baseUrl}/get/ProfilePicture`, franchiseeController.getProfilePicture);
    app.put(`${baseUrl}/updateProfilePic`, parser.uploadCloudinary.single("image"), franchiseeController.updateProfilePic)
    app.post(`${baseUrl}/uploadProfilePic`, parser.uploadCloudinary.single("image"), franchiseeController.uploadProfilePic);

    app.post(`${baseUrl}/get/AadharPDF`, franchiseeController.getAadharPDF);
    app.put(`${baseUrl}/updateAadhar`, parser.uploadCloudinary.single("image"), franchiseeController.updateAadhar)
    app.post(`${baseUrl}/uploadAadhar`, parser.uploadCloudinary.single("image"), franchiseeController.uploadAadhar);

    app.post(`${baseUrl}/get/PanPDF`, franchiseeController.getPanPDF);
    app.put(`${baseUrl}/updatepan`, parser.uploadCloudinary.single("image"), franchiseeController.updatepan);
    app.post(`${baseUrl}/uploadpan`, parser.uploadCloudinary.single("image"), franchiseeController.uploadpan);

    app.post(`${baseUrl}/get/FranOfficeDetails`, auth.isAuthorized, franchiseeController.getFranOfficeDetails);
    app.post(`${baseUrl}/FranOfficeDetails`, auth.isAuthorized, franchiseeController.franOfficeDetails);
    app.put(`${baseUrl}/updateFranOfficeDetails`, auth.isAuthorized, franchiseeController.updateOfficeDetails);

    app.post(`${baseUrl}/get/FranBankDetails`, auth.isAuthorized, franchiseeController.getFranBankDetails);
    app.post(`${baseUrl}/FranBankDetails`, auth.isAuthorized, franchiseeController.franbankDetails);
    app.put(`${baseUrl}/updateFranBankDetails`, auth.isAuthorized, franchiseeController.updatebankDetails);
    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/login api for user login.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Login Successful",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
                "userDetails": {
                "mobileNumber": 2234435524,
                "email": "someone@mail.com",
                "lastName": "Sengar",
                "firstName": "Rishabh",
                "userId": "-E9zxTYA8"
            }

        }
    */

    // params: email, password.
    app.post(`${baseUrl}/login`, franchiseeController.loginFunction);

    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/logout to logout user.
     *
     * @apiParam {string} userId userId of the user. (auth headers) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Logged Out Successfully",
            "status": 200,
            "data": null
        }
    */

    // auth token params: userId.
    app.post(`${baseUrl}/logout`, auth.isAuthorized, franchiseeController.logout);

    //customer realated routes
    app.post(`${baseUrl}/get/customer/all/Of/One:FranchiseeId`, auth.isAuthorized, customerController.getAllCustomersOfOne);

    app.post(`${baseUrl}/get/customer/:custId`, auth.isAuthorized, customerController.getSingleCustomerInfo);
    app.post(`${baseUrl}/add/customer`, auth.isAuthorized, customerController.addCustomer);    
    app.put(`${baseUrl}/update/customerBasic`, auth.isAuthorized, customerController.updateCustomerBasicDetails);

    app.post(`${baseUrl}/get/Cust/ProfilePicture`, customerController.getProfilePicture);
    app.put(`${baseUrl}/Cust/updateCustProfilePic`, parser.uploadCloudinary.single("image"), customerController.updateProfilePic)
    app.post(`${baseUrl}/Cust/uploadCustProfilePic`, parser.uploadCloudinary.single("image"), customerController.uploadProfilePic);

    app.post(`${baseUrl}/get/Cust/AadharPDF`, customerController.getAadharPDF);
    app.put(`${baseUrl}/Cust/updateCustAadhar`, parser.uploadCloudinary.single("image"), customerController.updateAadhar)
    app.post(`${baseUrl}/Cust/uploadCustAadhar`, parser.uploadCloudinary.single("image"), customerController.uploadAadhar);

    app.post(`${baseUrl}/get/Cust/PanPDF`, customerController.getPanPDF);
    app.put(`${baseUrl}/Cust/updateCustpan`, parser.uploadCloudinary.single("image"), customerController.updatepan)
    app.post(`${baseUrl}/Cust/uploadCustpan`, parser.uploadCloudinary.single("image"), customerController.uploadpan);
    
    app.post(`${baseUrl}/get/customerOcc/:custId`, auth.isAuthorized, customerController.getCustomerOccupation);
    app.post(`${baseUrl}/add/custOcc`, auth.isAuthorized, customerController.addCustomerOccupationalDetails);
    app.put(`${baseUrl}/update/custOcc`, auth.isAuthorized, customerController.updateCustomerOccupationalDetails);

    app.post(`${baseUrl}/get/customerFin/:custId`, auth.isAuthorized, customerController.getCustomerFinance);
    app.post(`${baseUrl}/add/custFin`, auth.isAuthorized, customerController.addCustomerFinancialDetails);
    app.put(`${baseUrl}/update/custFin`, auth.isAuthorized, customerController.updateCustomerFinancialDetails);

    app.post(`${baseUrl}/get/customerBank/:custId`, auth.isAuthorized, customerController.getCustomerBank);
    app.post(`${baseUrl}/add/custBank`, auth.isAuthorized, customerController.addCustomerBankDetails);
    app.put(`${baseUrl}/update/custBank`, auth.isAuthorized, customerController.updateCustomerBankDetails);

    app.post(`${baseUrl}/get/customerExistLoan/:custId`, auth.isAuthorized, customerController.getCustomerExistingLoan);
    app.post(`${baseUrl}/add/custExistLoan`, auth.isAuthorized, customerController.addCustExistLoan);
    app.put(`${baseUrl}/update/custExistLoan`, auth.isAuthorized, customerController.updateCustExistLoan);

    app.post(`${baseUrl}/get/customerCC/:custId`, auth.isAuthorized, customerController.getCustomerCCDetails);
    app.post(`${baseUrl}/add/ccDetails`, auth.isAuthorized, customerController.addCustomerCCDetails);
    app.put(`${baseUrl}/update/ccDetails`, auth.isAuthorized, customerController.updateCustCCDetails);

    app.post(`${baseUrl}/get/customerProperty/:custId`, auth.isAuthorized, customerController.getCustomerPropertyDetails);
    app.post(`${baseUrl}/add/custProperty`, auth.isAuthorized, customerController.addCustomerPropertyDetails);
    app.put(`${baseUrl}/udpate/custProperty`, auth.isAuthorized, customerController.updateCustProperty);

    app.post(`${baseUrl}/get/customerIns/:custId`, auth.isAuthorized, customerController.getCustomerInsurance);
    app.post(`${baseUrl}/add/custIns`, auth.isAuthorized, customerController.addCustInsurancedetails);
    app.put(`${baseUrl}/udpate/custIns`, auth.isAuthorized, customerController.updateCustInsurance);

    app.post(`${baseUrl}/get/customerLoanReq/:custId`, auth.isAuthorized, customerController.getCustomerLoanReq);
    app.post(`${baseUrl}/add/custLoanreq`, auth.isAuthorized, customerController.addCustLoanReq);
    app.put(`${baseUrl}/update/custLoanreq`, auth.isAuthorized, customerController.updateCustLoanReq);

    app.post(`${baseUrl}/get/customerLoanAmt/:custId`, auth.isAuthorized, customerController.getCustomerLoanAmt);
    app.post(`${baseUrl}/add/custLoanAmt`, auth.isAuthorized, customerController.addloanAmountDetails);
    app.put(`${baseUrl}/update/custLoanAmt`, auth.isAuthorized, customerController.updateCustLoanAmt);
    /* 
        app.post(`${baseUrl}/add/coApp`, auth.isAuthorized, customerController.addCoApplicant);
        app.post(`${baseUrl}/add/coAppFin`, auth.isAuthorized, customerController.addCoApplicantFinancialDetails);
        app.post(`${baseUrl}/add/coAppOcc`, auth.isAuthorized, customerController.addCoApplicantOccupationalDetails); */
}