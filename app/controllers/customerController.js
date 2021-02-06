const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('../libs/timeLib');
const response = require('../libs/responseLib')
const logger = require('../libs/loggerLib');
const check = require('../libs/checkLib');

/* Models */
const customerModel = mongoose.model('customer')
const CustomerOccupationModel = mongoose.model('CustomerOccupation')
const CustomerBankModel = mongoose.model('CustBankDetails');
const CustomerFinancialModel = mongoose.model('CustomerFinancial')
const CustPropertyModel = mongoose.model('CustPropertyDetails')
const CreditCardModel = mongoose.model('CreditCardDetails')
const CoApplicantModel = mongoose.model('CoApplicant');
const CoApplicantFinModel = mongoose.model('CoApplicantFinancial');
const CoApplicantOccuModel = mongoose.model('CoApplicantOccupation');
const CustLoanReqModel = mongoose.model('CustLoanReq');
const CustExistLoanModel = mongoose.model('CustomerExistingLoans');
const CustInsuranceModel = mongoose.model('CustInsuranceDetails');
const LoanAmountDetailsModel = mongoose.model('LoanAmountDetails');

/* Controller Methods */
let getAllCustomers = (req, res) => {
    
    customerModel.find({})
        .select(' -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'customerController: getAllCustomers', 10)
                let apiResponse = response.generate(true, 'Failed To Find customer Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Customer Found', 'customerController: getAllCustomers')
                let apiResponse = response.generate(true, 'No Customer Found', 404, null)
                res.send(apiResponse)
            } else {
                
                let apiResponse = response.generate(false, 'All Customer Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}

let getAllCustomersOfOne=(req,res)=>{
    customerModel.find({})
        .select(' -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'customerController: getAllCustomers', 10)
                let apiResponse = response.generate(true, 'Failed To Find customer Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Customer Found', 'customerController: getAllCustomers')
                let apiResponse = response.generate(true, 'No Customer Found', 404, null)
                res.send(apiResponse)
            } else {

                let apiResponse = response.generate(false, 'All Customer Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}

let getSingleCustomerInfo = (req, res) => {
    if (check.isEmpty(req.params.custId)) {

        console.log('custId should be passed')
        let apiResponse = response.generate(true, 'custId is missing', 403, null)
        res.send(apiResponse)
    } else {

        customerModel.findOne({ 'custId': req.params.custId }, (err, result) => {

            if (err) {
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {

                console.log('Customer Not Found.')
                let apiResponse = response.generate(true, 'Customer Not Found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info("Customer found successfully", "CustomerController:getSingleCustomerInfo", 5)
                let apiResponse = response.generate(false, 'Customer Found Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }
}

let addCustomer = (req, res) => {

    customerModel.findOne({ Email: req.body.Email })
        .exec((err, retrievedCustomerDetails) => {

            if (err) {
                logger.error(err.message, 'customerController.addCustomer()', 10);
                let apiResponse = response.generate(true, 'Operation Failed', 500, null);
                res.send(apiResponse)

            } else if (check.isEmpty(retrievedCustomerDetails)) {

                console.log(req.body);

                let newCustomer = new customerModel({
                    custId: shortid.generate(),
                    createdBy: req.body.createdBy,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    middleName: req.body.middleName,
                    Mother_name: req.body.Mother_name,
                    Father_name: req.body.Father_name,
                    Spouse_name: req.body.Spouse_name,
                    Date_of_birth: req.body.Date_of_birth,
                    Gender: req.body.Gender,
                    Category: req.body.Category,
                    Current_Address: req.body.Current_Address,
                    C_City: req.body.C_City,
                    C_Taluka: req.body.C_Taluka,
                    C_District: req.body.C_District,
                    C_State: req.body.c_state,
                    C_PinCode: req.body.C_PinCode,
                    Permanent_Address: req.body.Permanent_Address,
                    P_City: req.body.P_City,
                    P_Taluka: req.body.P_Taluka,
                    P_District: req.body.P_District,
                    P_State: req.body.P_State,
                    P_PinCode: req.body.P_PinCode,
                    Qualification: req.body.Qualification,
                    Mobile: req.body.Mobile,
                    Email: req.body.Email,
                    Passport: req.body.Passport,
                    PAN: req.body.PAN,
                    Aadhar: req.body.Aadhar,
                    DL_No: req.body.DL_No,
                    C_KYC_No: req.body.C_KYC_No,
                    Voter_ID: req.body.Voter_ID,
                    Period_of_stay: req.body.Period_of_stay,
                    created_on: time.now(),
                    modified_on: time.now()
                });

                newCustomer.save((err, newCustomer) => {

                    if (err) {

                        logger.error(err.message, 'customerController.addCustomer()', 10)
                        let apiResponse = response.generate(true, 'Failed to add new Customer', 500, null)
                        res.send(apiResponse)

                    } else {

                        let newCustObj = newCustomer.toObject();
                        let apiResponse = response.generate(false, 'Customer Added Successfully!', 200, newCustObj)
                        res.send(apiResponse)
                    }
                });

            } else {

                logger.error('Customer cannot be created. Customer already present.', 'customerController.addCustomer()', 4)
                let apiResponse = response.generate(true, 'Customer already present with this email ID', 403, null);
                res.send(apiResponse)
            }
        })
}

let updateCustomerBasicDetails = (req, res) => {
    let options = req.body;

    options.modified_on = time.now();

    customerModel.updateOne({ 'custId': req.body.custId }, options).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Customer Controller:updateCustomerBasicDetails', 10)
            let apiResponse = response.generate(true, 'Failed To edit Customer personal details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Customer Basic Details Found', 'Customer Controller: updateCustomerBasicDetails')
            let apiResponse = response.generate(true, 'No Customer Basic details Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Customer basic details edited', 200, result)
            res.send(apiResponse)
        }
    });
}

let getCustomerOccupation = (req, res) => {
    if (check.isEmpty(req.params.custId)) {

        console.log('custId should be passed')
        let apiResponse = response.generate(true, 'custId is missing', 403, null)
        res.send(apiResponse)
    } else {

        CustomerOccupationModel.findOne({ 'custId': req.params.custId }, (err, result) => {

            if (err) {
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {

                console.log('Customer Occupational Details Not Found.')
                let apiResponse = response.generate(true, 'Customer Occupational Details Not Found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info("Customer Occupational Details found successfully", "CustomerController:getCustomerOccupation", 5)
                let apiResponse = response.generate(false, 'Customer Occupational Details Found Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }
}

let addCustomerOccupationalDetails = (req, res) => {
    CustomerOccupationModel.findOne({ custId: req.body.custId })
        .exec((err, retrievedCustomerOccuDetails) => {

            if (err) {
                logger.error(err.message, 'customerController.addCustomerOccupationalDetails()', 10);
                let apiResponse = response.generate(true, 'Operation Failed', 500, null);
                res.send(apiResponse)

            } else if (check.isEmpty(retrievedCustomerOccuDetails)) {

                console.log(req.body);

                let newCustomerOccupation = new CustomerOccupationModel({
                    custId: req.body.custId,
                    Occupational_Category: req.body.Occupational_Category,
                    Employer_Business_Name: req.body.Employer_Business_Name,
                    Address: req.body.Address,
                    City: req.body.City,
                    Taluka: req.body.Taluka,
                    District: req.body.District,
                    State: req.body.State,
                    PinCode: req.body.PinCode,
                    Phone_No: req.body.Phone_No,
                    Employer_Business_Type: req.body.Employer_Business_Type,
                    Legal_Status: req.body.Legal_Status,
                    Designation: req.body.Designation,
                    Department: req.body.Department,
                    Employee_Code: req.body.Employee_Code,
                    Date_of_Joining_Commencement: req.body.Date_of_Joining_Commencement,
                    Total_work_experience: req.body.Total_work_experience,
                    GSTIN: req.body.GSTIN,
                    created_on: time.now(),
                    modified_on: time.now()
                });

                newCustomerOccupation.save((err, newCustomerOccupation) => {

                    if (err) {

                        logger.error(err.message, 'customerController.addCustomerOccupationalDetails()', 10)
                        let apiResponse = response.generate(true, 'Failed to add customer occupational details', 500, null)
                        res.send(apiResponse)

                    } else {

                        let newCustOccuObj = newCustomerOccupation.toObject();
                        let apiResponse = response.generate(false, 'Customer occupation details added successfully', 200, newCustOccuObj)
                        res.send(apiResponse);
                    }
                });

            } else {

                logger.error('Customer Occupation details cannot be saved. Customer occupational details are already present.', 'customerController.addCustomerOccupationalDetails()', 4)
                let apiResponse = response.generate(true, 'Customer Occupation details are already present with this ID', 403, null);
                res.send(apiResponse);
            }
        })
}

let updateCustomerOccupationalDetails = (req, res) => {
    let options = req.body;

    options.modified_on = time.now();

    CustomerOccupationModel.updateOne({ 'custId': req.body.custId }, options).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Customer Controller:updateCustomerOccupationalDetails', 10)
            let apiResponse = response.generate(true, 'Failed To edit Customer occupational details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Customer occupational Details Found', 'Customer Controller: updateCustomerOccupationalDetails')
            let apiResponse = response.generate(true, 'No Customer occupational details Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Customer occupational details edited', 200, result)
            res.send(apiResponse)
        }
    });
}

let getCustomerFinance = (req, res) => {
    if (check.isEmpty(req.params.custId)) {

        console.log('custId should be passed')
        let apiResponse = response.generate(true, 'custId is missing', 403, null)
        res.send(apiResponse)
    } else {

        CustomerFinancialModel.findOne({ 'custId': req.params.custId }, (err, result) => {

            if (err) {
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {

                console.log('Customer Financial Details Not Found.')
                let apiResponse = response.generate(true, 'Customer Financial Details Not Found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info("Customer Financial Details found successfully", "CustomerController:getCustomerFinance", 5)
                let apiResponse = response.generate(false, 'Customer Financial Details Found Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }
}

let addCustomerFinancialDetails = (req, res) => {
    CustomerFinancialModel.findOne({ custId: req.body.custId })
        .exec((err, retrievedCustomerFinDetails) => {

            if (err) {
                logger.error(err.message, 'customerController.addCustomerFinancialDetails()', 10);
                let apiResponse = response.generate(true, 'Operation Failed', 500, null);
                res.send(apiResponse)

            } else if (check.isEmpty(retrievedCustomerFinDetails)) {

                console.log(req.body);

                let newCustomerFinc = new CustomerFinancialModel({
                    custId: req.body.custId,
                    Gross_monthly_income: req.body.Gross_monthly_income,
                    Average_monthly_expenses: req.body.Average_monthly_expenses,
                    Assets_SB_Account: req.body.Assets_SB_Account,
                    Immovable_Property: req.body.Immovable_Property,
                    Current_balance_PF: req.body.Current_balance_PF,
                    Shares_Securities: req.body.Shares_Securities,
                    Fixed_Deposits: req.body.Fixed_Deposits,
                    Others_Assets: req.body.Others_Assets,
                    Total_Assets: req.body.Total_Assets,

                    Net_Monthly_Income: req.body.Net_Monthly_Income,
                    Credit_Society_Loan: req.body.Credit_Society_Loan,
                    Employer_Loan: req.body.Employer_Loan,
                    Home_Loan: req.body.Home_Loan,
                    PF_Loan: req.body.PF_Loan,
                    Vehicle_Loan: req.body.Vehicle_Loan,
                    Personal_Loan: req.body.Personal_Loan,
                    Other_Liabilities: req.body.Other_Liabilities,
                    Total_Liabilities: req.body.Total_Liabilities,
                    created_on: req.body.created_on,
                    modified_on: req.body.modified_on
                });

                newCustomerFinc.save((err, newCustomerFinc) => {

                    if (err) {

                        logger.error(err.message, 'customerController.addCustomerFinancialDetails()', 10)
                        let apiResponse = response.generate(true, 'Failed to add customer financial details', 500, null)
                        res.send(apiResponse)

                    } else {

                        let newCustFincObj = newCustomerFinc.toObject();
                        let apiResponse = response.generate(false, 'Customer financial details added successfully', 200, newCustFincObj);
                        res.send(apiResponse);
                    }
                });

            } else {

                logger.error('Customer financial details cannot be saved. Customer financial details are already present.', 'customerController.addCustomerFinancialDetails()', 4)
                let apiResponse = response.generate(true, 'Customer financial details are already present with this ID', 403, null);
                res.send(apiResponse);
            }
        })
}

let updateCustomerFinancialDetails = (req, res) => {
    let options = req.body;

    options.modified_on = time.now();

    CustomerFinancialModel.updateOne({ 'custId': req.body.custId }, options).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Customer Controller:updateCustomerFinancialDetails', 10)
            let apiResponse = response.generate(true, 'Failed To edit Customer financial details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Customer financial Details Found', 'Customer Controller: updateCustomerFinancialDetails')
            let apiResponse = response.generate(true, 'No Customer financial details Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Customer financial details edited', 200, result)
            res.send(apiResponse)
        }
    });
}

let getCustomerBank = (req, res) => {
    if (check.isEmpty(req.params.custId)) {

        console.log('custId should be passed')
        let apiResponse = response.generate(true, 'custId is missing', 403, null)
        res.send(apiResponse)
    } else {

        CustomerBankModel.findOne({ 'custId': req.params.custId }, (err, result) => {

            if (err) {
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {

                console.log('Customer Bank Details Not Found.')
                let apiResponse = response.generate(true, 'Customer Bank Details Not Found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info("Customer Bank Details found successfully", "CustomerController:getCustomerBank", 5)
                let apiResponse = response.generate(false, 'Customer Bank Details Found Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }
}

let addCustomerBankDetails = (req, res) => {
    CustomerBankModel.findOne({ custId: req.body.custId })
        .exec((err, retrievedCustomerBankDetails) => {

            if (err) {
                logger.error(err.message, 'customerController.addCustomerBankDetails()', 10);
                let apiResponse = response.generate(true, 'Operation Failed', 500, null);
                res.send(apiResponse)

            } else if (check.isEmpty(retrievedCustomerBankDetails)) {

                console.log(req.body);

                let newCustomerBank = new CustomerBankModel({
                    custId: req.body.custId,
                    Bank_Name: req.body.Bank_Name,
                    IFSC: req.body.IFSC,
                    Branch: req.body.Branch,
                    ACC_Type: req.body.ACC_Type,
                    Account_No: req.body.Account_No,
                    Opening_Date: req.body.Opening_Date,
                    Balance: req.body.Balance,
                    created_on: time.now(),
                    modified_on: time.now()
                });

                newCustomerBank.save((err, newCustomerBank) => {

                    if (err) {

                        logger.error(err.message, 'customerController.addCustomerBankDetails()', 10)
                        let apiResponse = response.generate(true, 'Failed to add customer bank details', 500, null)
                        res.send(apiResponse)

                    } else {

                        let newCustBankObj = newCustomerBank.toObject();
                        let apiResponse = response.generate(false, 'Customer Bank details added successfully', 200, newCustBankObj);
                        res.send(apiResponse);
                    }
                });

            } else {

                logger.error('Customer bank details cannot be saved. Customer bank details are already present.', 'customerController.addCustomerBankDetails()', 4)
                let apiResponse = response.generate(true, 'Customer bank details are already present with this ID', 403, null);
                res.send(apiResponse);
            }
        })
}

let updateCustomerBankDetails = (req, res) => {
    let options = req.body;

    options.modified_on = time.now();

    CustomerBankModel.updateOne({ 'custId': req.body.custId }, options).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Customer Controller:updateCustomerBankDetails', 10)
            let apiResponse = response.generate(true, 'Failed To edit Customer bank details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Customer bank Details Found', 'Customer Controller: updateCustomerBankDetails')
            let apiResponse = response.generate(true, 'No Customer bank details Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Customer bank details edited', 200, result)
            res.send(apiResponse)
        }
    });
}

let getCustomerExistingLoan = (req, res) => {
    if (check.isEmpty(req.params.custId)) {

        console.log('custId should be passed')
        let apiResponse = response.generate(true, 'custId is missing', 403, null)
        res.send(apiResponse)
    } else {

        CustExistLoanModel.findOne({ 'custId': req.params.custId }, (err, result) => {

            if (err) {
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {

                console.log('Customer Existing Loan Details Not Found.')
                let apiResponse = response.generate(true, 'Customer Existing Loan Details Not Found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info("Customer Existing Loan Details found successfully", "CustomerController:getCustomerExistingLoan", 5)
                let apiResponse = response.generate(false, 'Customer Existing Loan Details Found Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }
}

let addCustExistLoan = (req, res) => {
    console.log(req.body);

    let newCustExistLoan = new CustExistLoanModel({
        custId: req.body.custId,
        Loan_ID: shortid.generate(),
        Name_of_Institution: req.body.Name_of_Institution,
        Purpose_of_Loan: req.body.Purpose_of_Loan,
        Disbursed_Loan_Amount: req.body.Disbursed_Loan_Amount,
        Emi: req.body.Emi,
        Balance_Term: req.body.Balance_Term,
        Balance_Outstanding: req.body.Balance_Outstanding,
        created_on: time.now(),
        modified_on: time.now()
    });

    newCustExistLoan.save((err, newCustExistLoan) => {

        if (err) {

            logger.error(err.message, 'customerController.addCustExistLoan()', 10)
            let apiResponse = response.generate(true, 'Failed to add customer existing loan details', 500, null)
            res.send(apiResponse)

        } else {

            let newExistLoanObj = newCustExistLoan.toObject();
            let apiResponse = response.generate(false, 'Customer Existing Loan details added successfully', 200, newExistLoanObj);
            res.send(apiResponse);
        }
    });
}

let updateCustExistLoan = (req, res) => {
    let options = req.body;

    options.modified_on = time.now();

    CustExistLoanModel.updateOne({ 'custId': req.body.custId }, options).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Customer Controller:updateCustExistLoan', 10)
            let apiResponse = response.generate(true, 'Failed To edit Customer existing loan details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Customer existing loan Details Found', 'Customer Controller: updateCustExistLoan')
            let apiResponse = response.generate(true, 'No Customer existing loan details Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Customer existing loan details edited', 200, result)
            res.send(apiResponse)
        }
    });
}

let getCustomerCCDetails = (req, res) => {
    if (check.isEmpty(req.params.custId)) {

        console.log('custId should be passed')
        let apiResponse = response.generate(true, 'custId is missing', 403, null)
        res.send(apiResponse)
    } else {

        CreditCardModel.findOne({ 'custId': req.params.custId }, (err, result) => {

            if (err) {
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {

                console.log('Customer Credit Card Not Found.')
                let apiResponse = response.generate(true, 'Customer Credit Card Not Found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info("Customer Credit Card found successfully", "CustomerController:getCustomerCCDetails", 5)
                let apiResponse = response.generate(false, 'Customer Credit Card Found Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }
}

let addCustomerCCDetails = (req, res) => {

    console.log(req.body);

    let newCustomerCC = new CreditCardModel({
        custId: req.body.custId,
        Credit_Card_no: req.body.Credit_Card_no,
        Since: req.body.Since,
        Bank_name: req.body.Bank_Name,
        Credit_Limit: req.body.Credit_Limit,
        Outstanding_Amount: req.body.Outstanding_Amount,
        Balance_Term: req.body.Balance_Term,
        Balance_Outstanding: req.body.Balance_Outstanding,
        created_on: req.body.created_on,
        modified_on: req.body.modified_on
    });

    newCustomerCC.save((err, newCustomerCC) => {

        if (err) {

            logger.error(err.message, 'customerController.addCustomerCCDetails()', 10)
            let apiResponse = response.generate(true, 'Failed to add customer occupational details', 500, null)
            res.send(apiResponse)

        } else {

            let newCustCCObj = newCustomerCC.toObject();
            let apiResponse = response.generate(false, 'Customer property details added successfully', 200, newCustCCObj);
            res.send(apiResponse);
        }
    });

}

let updateCustCCDetails = (req, res) => {
    let options = req.body;

    options.modified_on = time.now();

    CreditCardModel.updateOne({ 'custId': req.body.custId }, options).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Customer Controller:updateCustCCDetails', 10)
            let apiResponse = response.generate(true, 'Failed To edit Customer Credit Card details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Customer Credit Card Details Found', 'Customer Controller: updateCustCCDetails')
            let apiResponse = response.generate(true, 'No Customer Credit Card details Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Customer Credit Card details edited', 200, result)
            res.send(apiResponse)
        }
    });
}

let getCustomerPropertyDetails = (req, res) => {
    if (check.isEmpty(req.params.custId)) {

        console.log('custId should be passed')
        let apiResponse = response.generate(true, 'custId is missing', 403, null)
        res.send(apiResponse)
    } else {

        CustPropertyModel.findOne({ 'custId': req.params.custId }, (err, result) => {

            if (err) {
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {

                console.log('Customer Property Details Not Found.')
                let apiResponse = response.generate(true, 'Customer Property Details Not Found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info("Customer Property Details found successfully", "CustomerController:getCustomerPropertyDetails", 5)
                let apiResponse = response.generate(false, 'Customer Property Details Found Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }
}

let addCustomerPropertyDetails = (req, res) => {

    console.log(req.body);

    let newCustomerProperty = new CustPropertyModel({
        custId: req.body.custId,
        Address: req.body.Address,
        City: req.body.City,
        Taluka: req.body.Taluka,
        District: req.body.District,
        State: req.body.State,
        Pin_code: req.body.Pin_code,
        Land_mark: req.body.Land_mark,
        Property_Type: req.body.Property_Type,
        Land_Area: req.body.Land_Area,
        Built_up_area: req.body.Built_up_area,
        Ownership_type: req.body.Ownership_type,
        Land_type: req.body.Land_type,
        Construction_stage: req.body.Construction_stage,
        ConstructionStagePercent: req.body.ConstructionStagePercent,
        Approx_value: req.body.Approx_value,
        created_on: req.body.created_on,
        modified_on: req.body.modified_on
    });

    newCustomerProperty.save((err, newCustomerProperty) => {

        if (err) {

            logger.error(err.message, 'customerController.addCustomerPropertyDetails()', 10)
            let apiResponse = response.generate(true, 'Failed to add customer occupational details', 500, null)
            res.send(apiResponse)

        } else {

            let newCustPropObj = newCustomerProperty.toObject();
            let apiResponse = response.generate(false, 'Customer property details added successfully', 200, newCustPropObj);
            res.send(apiResponse);
        }
    });

}

let updateCustProperty = (req, res) => {
    let options = req.body;

    options.modified_on = time.now();

    CustPropertyModel.updateOne({ 'custId': req.body.custId }, options).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Customer Controller:updateCustProperty', 10)
            let apiResponse = response.generate(true, 'Failed To edit Customer Property details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Customer Property Details Found', 'Customer Controller: updateCustProperty')
            let apiResponse = response.generate(true, 'No Customer Property details Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Customer Property details edited', 200, result)
            res.send(apiResponse)
        }
    });
}

let getCustomerInsurance = (req, res) => {
    if (check.isEmpty(req.params.custId)) {

        console.log('custId should be passed')
        let apiResponse = response.generate(true, 'custId is missing', 403, null)
        res.send(apiResponse)
    } else {

        CustInsuranceModel.findOne({ 'custId': req.params.custId }, (err, result) => {

            if (err) {
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {

                console.log('Customer Insurance Details Not Found.')
                let apiResponse = response.generate(true, 'Customer Insurance Details Not Found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info("Customer Insurance Details found successfully", "CustomerController:getCustomerInsurance", 5)
                let apiResponse = response.generate(false, 'Customer Insurance Details Found Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }
}

let addCustInsurancedetails = (req, res) => {
    console.log(req.body);

    let newCustInsurance = new CustInsuranceModel({
        custId: req.body.custId,
        Policy_no: req.body.Policy_no,
        Policy_name: req.body.Policy_name,
        Issued_By: req.body.Issued_By,
        Maturity_date: req.body.Maturity_date,
        Policy_value: req.body.Policy_value,
        Policy_Type: req.body.Policy_Type,
        Premium: req.body.Premium,
        created_on: req.body.created_on,
        modified_on: req.body.modified_on
    });

    newCustInsurance.save((err, newCustInsurance) => {

        if (err) {

            logger.error(err.message, 'customerController.addCustInsurancedetails()', 10)
            let apiResponse = response.generate(true, 'Failed to add customer insurance details', 500, null)
            res.send(apiResponse)

        } else {

            let newCustInsuObj = newCustInsurance.toObject();
            let apiResponse = response.generate(false, 'Customer Insurance details added successfully', 200, newCustInsuObj);
            res.send(apiResponse);
        }
    });
}

let updateCustInsurance = (req, res) => {
    let options = req.body;

    options.modified_on = time.now();

    CustInsuranceModel.updateOne({ 'custId': req.body.custId }, options).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Customer Controller:updateCustInsurance', 10)
            let apiResponse = response.generate(true, 'Failed To edit Customer Insurance details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Insurance Details Found', 'Customer Controller: updateCustInsurance')
            let apiResponse = response.generate(true, 'No Customer Insurance details Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Customer Insurance details edited', 200, result)
            res.send(apiResponse)
        }
    });
}

let getCustomerLoanReq = (req, res) => {
    if (check.isEmpty(req.params.custId)) {

        console.log('custId should be passed')
        let apiResponse = response.generate(true, 'custId is missing', 403, null)
        res.send(apiResponse)
    } else {

        CustLoanReqModel.findOne({ 'custId': req.params.custId }, (err, result) => {

            if (err) {
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {

                console.log('Customer Loan Requirement Details Not Found.')
                let apiResponse = response.generate(true, 'Customer Loan Requirement Details Not Found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info("Customer Loan Requirement Details found successfully", "CustomerController:getCustomerLoanReq", 5)
                let apiResponse = response.generate(false, 'Customer Loan Requirement Details Found Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }
}

let addCustLoanReq = (req, res) => {
    console.log(req.body);

    let newCustLoanReq = new CustLoanReqModel({
        custId: req.body.custId,
        Loan_Id: shortid.generate(),
        Purpose_of_Loan: req.body.Purpose_of_Loan,
        Loan_Amount: req.body.Loan_Amount,
        Loan_Tenure: req.body.Loan_Amount,
        Interest_Option: req.body.Interest_Option,
        Payment_Method: req.body.Payment_Method,
        created_on: req.body.created_on,
        modified_on: req.body.modified_on
    });

    newCustLoanReq.save((err, newCustLoanReq) => {

        if (err) {

            logger.error(err.message, 'customerController.addCustLoanReq()', 10)
            let apiResponse = response.generate(true, 'Failed to add customer loan requirements', 500, null)
            res.send(apiResponse)

        } else {

            let newLoanReqObj = newCustLoanReq.toObject();
            let apiResponse = response.generate(false, 'Customer Loan Requirement details added successfully', 200, newLoanReqObj);
            res.send(apiResponse);
        }
    });
}

let updateCustLoanReq = (req, res) => {
    let options = req.body;

    options.modified_on = time.now();

    CustLoanReqModel.updateOne({ 'custId': req.body.custId }, options).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Customer Controller:updateCustLoanReq', 10)
            let apiResponse = response.generate(true, 'Failed To edit Customer Loan Requirement details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Customer Loan Requirement Details Found', 'Customer Controller: updateCustLoanReq')
            let apiResponse = response.generate(true, 'No Customer Loan Requirement details Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Customer Loan Requirement details edited', 200, result)
            res.send(apiResponse)
        }
    });
}

let getCustomerLoanAmt = (req, res) => {
    if (check.isEmpty(req.params.custId)) {

        console.log('custId should be passed')
        let apiResponse = response.generate(true, 'custId is missing', 403, null)
        res.send(apiResponse)
    } else {

        LoanAmountDetailsModel.findOne({ 'custId': req.params.custId }, (err, result) => {

            if (err) {
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {

                console.log('Customer Loan Amount Details Not Found.')
                let apiResponse = response.generate(true, 'Customer Loan Amount Details Not Found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info("Customer Loan Amount Details found successfully", "CustomerController:getCustomerLoanAmt", 5)
                let apiResponse = response.generate(false, 'Customer Loan Amount Details Found Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }
}

let addloanAmountDetails = (req, res) => {
    console.log(req.body);

    let newLoanAmtDetails = new LoanAmountDetailsModel({
        custId: req.body.custId,
        Loan_Id: req.body.Loan_ID,
        Land_cost: req.body.Land_cost,
        Agreement_value: req.body.Agreement_value,
        Amenities_agreement: req.body.Amenities_agreement,
        Stamp_Duty_Reg_Charge: req.body.Stamp_Duty_Reg_Charge,
        Cost_of_Contruction_Ext_Imp: req.body.Cost_of_Contruction_Ext_Imp,
        Incidental: req.body.Incidental,
        Total_Requirement_funds: req.body.Total_Requirement_funds,
        Amount_spent: req.body.Amount_spent,
        Balance_fund: req.body.Balance_fund,
        Savings: req.body.Savings,
        Disposal_of_asset: req.body.Disposal_of_asset,
        Family: req.body.Family,
        Others: req.body.Others,
        Total_balance_fund: req.body.Total_balance_fund,
        Loan_requirement: req.body.Loan_requirement,
        Total_source_of_funds: req.body.Total_source_of_funds,
        created_on: req.body.created_on,
        modified_on: req.body.modified_on
    });

    newLoanAmtDetails.save((err, newLoanAmtDetails) => {

        if (err) {

            logger.error(err.message, 'customerController.addloanAmountDetails()', 10)
            let apiResponse = response.generate(true, 'Failed to add customer insurance details', 500, null)
            res.send(apiResponse)

        } else {

            let newLoanAmtObj = newLoanAmtDetails.toObject();
            let apiResponse = response.generate(false, 'Customer Loan Amount details added successfully', 200, newLoanAmtObj);
            res.send(apiResponse);
        }
    });
}

let updateCustLoanAmt = (req, res) => {
    let options = req.body;

    options.modified_on = time.now();

    LoanAmountDetailsModel.updateOne({ 'custId': req.body.custId }, options).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Customer Controller:updateCustLoanAmt', 10)
            let apiResponse = response.generate(true, 'Failed To edit Customer Loan Amount details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Customer Loan Amount Details Found', 'Customer Controller: updateCustLoanAmt')
            let apiResponse = response.generate(true, 'No Customer Loan Amount details Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Customer Loan Amount details edited', 200, result)
            res.send(apiResponse)
        }
    });
}


let addCoApplicant = (req, res) => {

    CoApplicantModel.findOne({ Email: req.body.Email })
        .exec((err, retrievedCoApplicantDetails) => {

            if (err) {
                logger.error(err.message, 'customerController.addCoApplicant()', 10);
                let apiResponse = response.generate(true, 'Operation Failed', 500, null);
                res.send(apiResponse)

            } else if (check.isEmpty(retrievedCoApplicantDetails)) {

                console.log(req.body);

                let newCoApplicant = new CoApplicantModel({
                    coApplicant_Id: shortid.generate(),
                    custId: req.body.custId,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    middleName: req.body.middleName,
                    Mother_name: req.body.Mother_name,
                    Father_name: req.body.Father_name,
                    Spouse_name: req.body.Spouse_name,
                    Date_of_birth: req.body.Date_of_birth,
                    Gender: req.body.Gender,
                    Category: req.body.Category,
                    Current_Address: req.body.Current_Address,
                    C_City: req.body.C_City,
                    C_Taluka: req.body.C_Taluka,
                    C_District: req.body.C_District,
                    C_State: req.body.c_state,
                    C_PinCode: req.body.C_PinCode,
                    Permanent_Address: req.body.Permanent_Address,
                    P_City: req.body.P_City,
                    P_Taluka: req.body.P_Taluka,
                    P_District: req.body.P_District,
                    P_State: req.body.P_State,
                    P_PinCode: req.body.P_PinCode,
                    Qualification: req.body.Qualification,
                    Mobile: req.body.Mobile,
                    Email: req.body.Email,
                    Passport: req.body.Passport,
                    PAN: req.body.PAN,
                    Aadhar: req.body.Aadhar,
                    DL_No: req.body.DL_No,
                    C_KYC_No: req.body.C_KYC_No,
                    Voter_ID: req.body.Voter_ID,
                    Period_of_stay: req.body.Period_of_stay,
                    created_on: time.now(),
                    modified_on: time.now(),

                    firstName: req.body.firstName,
                    lastName: req.body, lastName,
                    middleName: req.body.middleName,
                    Mother_name: req.body.Mother_name,
                    Father_name: req.body.Father_name,
                    Spouse_name: req.body.Spouse_name,
                    Date_of_birth: req.body.Date_of_birth,
                    Gender: req.body.Gender,
                    Category: req.body.Category,
                    Current_Address: req.body.Current_Address,
                    C_City: req.body.C_City,
                    C_Taluka: req.body.C_Taluka,
                    C_District: req.body.C_District,
                    C_State: req.body.c_state,
                    C_PinCode: req.body.C_PinCode,
                    Permanent_Address: req.body.Permanent_Address,
                    P_City: req.body.P_City,
                    P_Taluka: req.body.P_Taluka,
                    P_District: req.body.P_District,
                    P_State: req.body.P_State,
                    P_PinCode: req.body.P_PinCode,
                    Qualification: req.body.Qualification,
                    Mobile: req.body.Mobile,
                    Email: req.body.Email,
                    Passport: req.body.Passport,
                    PAN: req.body.PAN,
                    Aadhar: req.body.Aadhar,
                    DL_No: req.body.DL_No,
                    C_KYC_No: req.body.C_KYC_No,
                    Voter_ID: req.body.Voter_ID,
                    Period_of_stay: req.body.Period_of_stay,
                    created_on: time.now(),
                    modified_on: time.now()
                });

                newCoApplicant.save((err, newCoApplicant) => {

                    if (err) {

                        logger.error(err.message, 'customerController.addCoApplicant()', 10)
                        let apiResponse = response.generate(true, 'Failed to add new Co-Applicant', 500, null)
                        res.send(apiResponse)

                    } else {

                        let newCoAppcObj = newCoApplicant.toObject();
                        res.send(newCoAppcObj)
                    }
                });

            } else {

                logger.error('Co-Applicant cannot be created. Co-Applicant already present.', 'customerController.addCoApplicant()', 4)
                let apiResponse = response.generate(true, 'Co-Applicant already present with this email ID', 403, null);
                res.send(apiResponse)
            }
        })
}

let addCoApplicantOccupationalDetails = (req, res) => {
    CoApplicantOccuModel.findOne({ custId: req.body.custId })
        .exec((err, retrievedCoApplicantOccuDetails) => {

            if (err) {

                logger.error(err.message, 'customerController.addCoApplicantOccupationalDetails()', 10);
                let apiResponse = response.generate(true, 'Operation Failed', 500, null);
                res.send(apiResponse)

            } else if (check.isEmpty(retrievedCoApplicantOccuDetails)) {

                console.log(req.body);

                let newCoAppOccupation = new CoApplicantOccuModel({
                    coApplicant_Id: req.body.coApplicant_Id,
                    Occupational_Category: req.body.Occupational_Category,
                    Employer_Business_Name: req.body.Employer_Business_Name,
                    Address: req.body.Address,
                    City: req.body.City,
                    Taluka: req.body.Taluka,
                    District: req.body.District,
                    State: req.body.State,
                    PinCode: req.body.PinCode,

                    Phone_No: req.body.Phone_No,
                    Employer_Business_Type: req.body.Employer_Business_Type,
                    Legal_Status: req.body.Legal_Status,
                    Designation: req.body.Designation,
                    Department: req.body.Department,
                    Employee_Code: req.body.Employee_Code,
                    Date_of_Joining_Commencement: req.body.Date_of_Joining_Commencement,
                    Total_work_experience: req.body.Total_work_experience,
                    GSTIN: req.body.GSTIN
                });

                newCoAppOccupation.save((err, newCoAppOccupation) => {

                    if (err) {

                        logger.error(err.message, 'customerController.addCoApplicantOccupationalDetails()', 10)
                        let apiResponse = response.generate(true, 'Failed to add customer occupational details', 500, null)
                        res.send(apiResponse)

                    } else {

                        let newCoAppOccuObj = newCoAppOccupation.toObject();
                        res.send(newCoAppOccuObj)
                    }
                });

            } else {

                logger.error('Co-Applicant Occupation details cannot be saved. Co-Applicant occupational details are already present.', 'customerController.addCoApplicantOccupationalDetails()', 4)
                let apiResponse = response.generate(true, 'Customer Occupation details are already present with this ID', 403, null);
                res.send(apiResponse);
            }
        })
}

let addCoApplicantFinancialDetails = (req, res) => {

    console.log(req.body);

    let newCoAppFinc = new CoApplicantFinModel({
        coApplicant_Id: req.body.coApplicant_Id,
        Gross_monthly_income: req.body.Gross_monthly_income,
        Average_monthly_expenses: req.body.Average_monthly_expenses,
        Assets_SB_Account: req.body.Assets_SB_Account,
        Immovable_Property: req.body.Immovable_Property,
        Current_balance_PF: req.body.Current_balance_PF,
        Shares_Securities: req.body.Shares_Securities,
        Fixed_Deposits: req.body.Fixed_Deposits,
        Others_Assets: req.body.Others_Assets,
        Total_Assets: req.body.Total_Assets,

        Net_Monthly_Income: req.body.Net_Monthly_Income,
        Credit_Society_Loan: req.body.Credit_Society_Loan,
        Employer_Loan: req.body.Employer_Loan,
        Home_Loan: req.body.Home_Loan,
        PF_Loan: req.body.PF_Loan,
        Vehicle_Loan: req.body.Vehicle_Loan,
        Personal_Loan: req.body.Personal_Loan,
        Other_Liabilities: req.body.Other_Liabilities,
        Total_Liabilities: req.body.Total_Liabilities,
        created_On: req.body.created_On,
        modified_On: req.body.modified_on
    });

    newCoAppFinc.save((err, newCoAppFinc) => {

        if (err) {

            logger.error(err.message, 'customerController.addCoApplicantFinancialDetails()', 10)
            let apiResponse = response.generate(true, 'Failed to add Co-Applicant financial details', 500, null)
            res.send(apiResponse)

        } else {

            let newCoAppFincObj = newCoAppFinc.toObject();
            res.send(newCoAppFincObj)
        }
    });
}


module.exports = {
    getAllCustomers: getAllCustomers,
    getAllCustomersOfOne: getAllCustomersOfOne,

    getSingleCustomerInfo: getSingleCustomerInfo,
    addCustomer: addCustomer,
    updateCustomerBasicDetails: updateCustomerBasicDetails,

    getCustomerOccupation: getCustomerOccupation,
    addCustomerOccupationalDetails: addCustomerOccupationalDetails,
    updateCustomerOccupationalDetails: updateCustomerOccupationalDetails,

    getCustomerFinance: getCustomerFinance,
    addCustomerFinancialDetails: addCustomerFinancialDetails,
    updateCustomerFinancialDetails: updateCustomerFinancialDetails,

    getCustomerBank: getCustomerBank,
    addCustomerBankDetails: addCustomerBankDetails,
    updateCustomerBankDetails: updateCustomerBankDetails,

    getCustomerCCDetails: getCustomerCCDetails,
    addCustomerCCDetails: addCustomerCCDetails,
    updateCustCCDetails: updateCustCCDetails,

    getCustomerExistingLoan: getCustomerExistingLoan,
    addCustExistLoan: addCustExistLoan,
    updateCustExistLoan: updateCustExistLoan,

    getCustomerPropertyDetails: getCustomerPropertyDetails,
    addCustomerPropertyDetails: addCustomerPropertyDetails,
    updateCustProperty: updateCustProperty,

    getCustomerInsurance: getCustomerInsurance,
    addCustInsurancedetails: addCustInsurancedetails,
    updateCustInsurance: updateCustInsurance,

    getCustomerLoanReq: getCustomerLoanReq,
    addCustLoanReq: addCustLoanReq,
    updateCustLoanReq: updateCustLoanReq,

    getCustomerLoanAmt: getCustomerLoanAmt,
    addloanAmountDetails: addloanAmountDetails,
    updateCustLoanAmt: updateCustLoanAmt,


    addCoApplicantFinancialDetails: addCoApplicantFinancialDetails,
    addCoApplicant: addCoApplicant,
    addCoApplicantOccupationalDetails: addCoApplicantOccupationalDetails
}