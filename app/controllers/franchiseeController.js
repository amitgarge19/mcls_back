const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('../libs/timeLib');
const response = require('../libs/responseLib')
const logger = require('../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib');
const token = require('../libs/tokenLib');
const passwordLib = require('../libs/generatePassordLib')
const cloudinary = require('../libs/cloudi')

/* Models */
const FranchiseeModel = mongoose.model('Franchisee')
const ProfilePictureModel = mongoose.model('ProfilePicture');
const AadharModel = mongoose.model('Aadhar');
const PanModel = mongoose.model('PAN');
const FranchiseeBankModel = mongoose.model('FranchiseeBank')
const FranchiseeOfficeModel = mongoose.model('FranchiseeOffice')
const AuthModel = mongoose.model('Auth');

/*User account related functions*/
let loginFunction = (req, res) => {

    let findFranchisee = () => {

        console.log("findFranchisee");
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                console.log("req body email is there");
                console.log(req.body);
                FranchiseeModel.findOne({ email: req.body.email }, (err, FranchiseeDetails) => {
                    /* handle the error here if the Franchisee is not found */
                    if (err) {
                        console.log(err)
                        logger.error('Failed To Retrieve Franchisee Data', 'FranchiseeController: findFranchisee()', 10)
                        /* generate the error message and the api response message here */
                        let apiResponse = response.generate(true, 'Failed To Find Franchisee Details', 500, null)
                        reject(apiResponse)
                        /* if Company Details is not found */
                    } else if (check.isEmpty(FranchiseeDetails)) {
                        /* generate the response and the console error message here */
                        logger.error('No Franchisee Found', 'FranchiseeController: findFranchisee()', 7)
                        let apiResponse = response.generate(true, 'No Franchisee Details Found', 404, null)
                        reject(apiResponse)
                    } else {
                        /* prepare the message and the api response here */
                        logger.info('Franchisee Found', 'FranchiseeController: findFranchisee()', 10)
                        resolve(FranchiseeDetails)
                    }
                });

            } else {
                let apiResponse = response.generate(true, '"email" parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }

    let validatePassword = (retrievedFranchiseeDetails) => {
        console.log("validatePassword");
        return new Promise((resolve, reject) => {
            passwordLib.comparePassword(req.body.password, retrievedFranchiseeDetails.password, (err, isMatch) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'FranchiseeController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Login Failed', 500, null)
                    reject(apiResponse)
                } else if (isMatch) {
                    let retrievedFranchiseeDetailsObj = retrievedFranchiseeDetails.toObject()
                    delete retrievedFranchiseeDetailsObj.password
                    delete retrievedFranchiseeDetailsObj._id
                    delete retrievedFranchiseeDetailsObj.__v
                    delete retrievedFranchiseeDetailsObj.created_on
                    delete retrievedFranchiseeDetailsObj.modified_on
                    resolve(retrievedFranchiseeDetailsObj)
                } else {
                    logger.info('Login Failed Due To Invalid Password', 'FranchiseeController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Wrong Password.Login Failed', 400, null)
                    reject(apiResponse)
                }
            });
        });
    }
    let generateToken = (FranchiseeDetails) => {
        console.log("generate token");
        return new Promise((resolve, reject) => {
            token.generateToken(FranchiseeDetails, (err, tokenDetails) => {
                if (err) {
                    console.log(err)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else {
                    tokenDetails.FranchiseeId = FranchiseeDetails.FranchiseeId
                    tokenDetails.FranchiseeDetails = FranchiseeDetails
                    resolve(tokenDetails)
                }
            })
        })
    }
    let saveToken = (tokenDetails) => {
        console.log("save token");
        return new Promise((resolve, reject) => {
            AuthModel.findOne({ FranchiseeId: tokenDetails.FranchiseeId }, (err, retrievedTokenDetails) => {
                if (err) {
                    console.log(err.message, 'FranchiseeController: saveToken', 10)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(retrievedTokenDetails)) {
                    let newAuthToken = new AuthModel({
                        FranchiseeId: tokenDetails.FranchiseeId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenerationTime: time.now()
                    });
                    newAuthToken.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'FranchiseeController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                FranchiseeDetails: tokenDetails.FranchiseeDetails
                            }
                            resolve(responseBody)
                        }
                    });
                } else {
                    retrievedTokenDetails.authToken = tokenDetails.token
                    retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret
                    retrievedTokenDetails.tokenGenerationTime = time.now()
                    retrievedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'FranchiseeController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                FranchiseeDetails: tokenDetails.FranchiseeDetails
                            }
                            resolve(responseBody)
                        }
                    });
                }
            });
        });
    }

    findFranchisee(req, res)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Login Successful', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log("errorhandler");
            console.log(err);
            res.status(err.status)
            res.send(err)
        });
}

let getFranchiseeById = (req, res) => {
    if (check.isEmpty(req.body.FranchiseeId)) {

        console.log('FranchiseeId should be passed')
        let apiResponse = response.generate(true, 'FranchiseeId is missing', 403, null)
        res.send(apiResponse)
    } else {

        FranchiseeModel.findOne({ 'FranchiseeId': req.body.FranchiseeId }, (err, result) => {

            if (err) {
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)

            } else if (check.isEmpty(result)) {

                console.log('Franchisee Not Found.')
                let apiResponse = response.generate(true, 'FranchiseeId Not Found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info("Franchisee found successfully", "FranchiseeController:getFranchiseeById", 5)
                let apiResponse = response.generate(false, 'Franchisee Found Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }
}

let logout = (req, res) => {
    AuthModel.findOneAndRemove({ FranchiseeId: req.body.FranchiseeId }, (err, result) => {

        if (err) {

            console.log(err)
            logger.error(err.message, 'Franchisee Controller: logout', 10)
            let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
            res.send(apiResponse)

        } else if (check.isEmpty(result)) {

            let apiResponse = response.generate(true, 'Already Logged Out or Invalid FranchiseeId', 404, null)
            res.send(apiResponse)

        } else {

            let apiResponse = response.generate(false, 'Logged Out Successfully', 200, null)
            res.send(apiResponse)
        }
    })
}
/* END User account related functions*/


/* Franchisee Personal Information related functions */
let signUpFunction = (req, res) => {
    let validateFranchiseeInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                if (!validateInput.Email(req.body.email)) {
                    let apiResponse = response.generate(true, 'Email does not meet the requirement', 400, null);
                    reject(apiResponse);
                } else if (check.isEmpty(req.body.password)) {
                    let apiResponse = response.generate(true, 'Password is missing', 400, null);
                    reject(apiResponse);
                } else {
                    resolve(req);
                }
            } else {
                logger.error('Field missing during Franchisee creation', 'FranchiseeController.signUpFunction.validateFranchiseeInput', 5);
                let apiResponse = response.generate(true, 'One or more parameter is missing', 404, null);
                reject(apiResponse);
            }
        });
    }

    let createFranchisee = () => {
        return new Promise((resolve, reject) => {
            FranchiseeModel.findOne({ email: req.body.email })
                .exec((err, retrievedFranchiseeDetails) => {

                    if (err) {
                        logger.error(err.message, 'FranchiseeController.signupFunction.createFranchisee()', 10);
                        let apiResponse = response.generate(true, 'Operation Failed', 500, null);
                        reject(apiResponse)
                    } else if (check.isEmpty(retrievedFranchiseeDetails)) {

                        console.log(req.body);

                        let newFranchisee = new FranchiseeModel({
                            FranchiseeId: shortid.generate(),
                            firstName: req.body.firstName,                            
                            middleName: req.body.middleName,
                            lastName: req.body.lastName,
                            email: req.body.email.toLowerCase(),
                            password: passwordLib.hashpassword(req.body.password),
                            mobileNumber: req.body.mobileNumber,
                            created_on: time.now(),
                            modified_on: time.now()
                        });

                        newFranchisee.save((err, newFranchisee) => {

                            if (err) {

                                logger.error(err.message, 'FranchiseeController.signUpFunction().createFranchisee()', 10)
                                let apiResponse = response.generate(true, 'Failed to create new Franchisee', 500, null)
                                reject(apiResponse)

                            } else {

                                let newFrancObj = newFranchisee.toObject();
                                resolve(newFrancObj)
                            }
                        });

                    } else {

                        logger.error('Franchisee cannot be created. Frachisee already present.', 'FranchiseeController.signUpFunction().createFranchisee()', 4)
                        let apiResponse = response.generate(true, 'Franchisee already present with this email ID', 403, null);
                        reject(apiResponse);
                    }
                })
        })
    }

    validateFranchiseeInput(req, res)
        .then(createFranchisee)
        .then((resolve) => {
            delete resolve.password
            let apiResponse = response.generate(false, 'Franchisee created sucessfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            logger.error(err.message, 'FranchiseeController.signUpFunction.catchBlock', 10);
            let apiResponse = response.generate(true, 'Franchisee creation failed', 500, null)
            res.send(apiResponse);
        })
}

let franchAdditionalDetails = (req, res) => {

    let options = req.body;

    options.modified_on = time.now();

    FranchiseeModel.updateOne({ 'FranchiseeId': req.body.FranchiseeId }, options).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Franchisee Controller:franchAdditionalDetails', 10)
            let apiResponse = response.generate(true, 'Failed To edit Franchisee details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Franchisee Found', 'Franchisee Controller: franchAdditionalDetails')
            let apiResponse = response.generate(true, 'No Franchisee Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Franchisee details edited', 200, result)
            res.send(apiResponse)
        }


    });// end Franchisee model update
}

/* Multimedia Data Profile Picture, PAN and Aadhar */

//Profile Picture related Functions
let getProfilePicture = (req, res) => {
    if (check.isEmpty(req.body.FranchiseeId)) {

        console.log('FranchiseeId should be passed')
        let apiResponse = response.generate(true, 'FranchiseeId is missing', 403, null)
        res.send(apiResponse)
    } else {

        ProfilePictureModel.findOne({ 'FranchiseeId': req.body.FranchiseeId }, (err, result) => {

            if (err) {
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)

            } else if (check.isEmpty(result)) {

                console.log('Profile Picture Not Found.')
                let apiResponse = response.generate(true, 'Profile Picture Not Found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info("Profile Picture found successfully", "FranchiseeController:getProfilePicture", 5)
                let apiResponse = response.generate(false, 'Profile Picture Found Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }
}

let uploadProfilePic = (req, res) => {
    if (req.body.FranchiseeId) {
        console.log("req body franId is there");
        console.log(req.body);
        ProfilePictureModel.findOne({ "FranchiseeId": req.body.FranchiseeId }, (err, FranchiseeProfilePictureDetails) => {

            /* handle the error here if the Franchisee Profile Picture Details details are not found */
            if (err) {
                console.log(err)
                logger.error('Failed To Retrieve Franchisee Profile picture Data', 'FranchiseeController: uploadProfilePic()', 10)
                /* generate the error message and the api response message here */
                let apiResponse = response.generate(true, 'Failed To Find Franchisee Profile Picture Details', 500, null)
                res.send(apiResponse)

            } else {

                console.log(req.file) // to see what is returned to you

                const file = {};

                file.FranchiseeId = req.body.FranchiseeId;
                file.public_id = req.file.public_id;
                file.url = req.file.url;

                ProfilePictureModel.create(file) // save image information in database

                    .then(newFile => res.json(newFile))

                    .catch(
                        err => logger.error(err, 'userController.uploadProfilePic()', 8))
            }
        });
    } else {
        let apiResponse = response.generate(true, '"FranchiseeId" parameter is missing in the request of uploadProfilePicture', 400, null)
        res.send(apiResponse);
    }
}

let updateProfilePic = (req, res) => {

    if (req.body.FranchiseeId) {
        console.log("req body franId is there");
        console.log(req.body);

        let toDeleteAssetFromCloudinary = req.body.AssetToDelete;
        console.log("toDeleteAssetFromCloudinary=" + toDeleteAssetFromCloudinary);

        ProfilePictureModel.findOne({ FranchiseeId: req.body.FranchiseeId }, (err, FranchiseeProfilePictureDetails) => {

            /* handle the error here if the Franchisee Profile Picture Details details are not found */
            if (err) {
                console.log(err)
                logger.error('Failed To Retrieve Franchisee Profile picture Data', 'FranchiseeController: uploadProfilePic()', 10)
                /* generate the error message and the api response message here */
                let apiResponse = response.generate(true, 'Failed To Find Franchisee Profile Picture Details', 500, null)
                res.send(apiResponse)

            } else if (check.isEmpty(FranchiseeProfilePictureDetails)) {
                console.log('Profile Picture Not Found.')
                let apiResponse = response.generate(true, 'Profile Picture Not Found', 404, null)
                res.send(apiResponse)

            } else if (!check.isEmpty(FranchiseeProfilePictureDetails)) {

                let options = req.file;

                console.log(req.file) // to see what is returned to you                

                ProfilePictureModel.updateOne({ 'FranchiseeId': req.body.FranchiseeId }, options).exec((err, result) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'Franchisee Controller:updateFranOfficeDetails', 10)
                        let apiResponse = response.generate(true, 'Failed To update Franchisee profile picture', 500, null)
                        res.send(apiResponse)
                    } else if (check.isEmpty(result)) {
                        logger.info('No Franchisee Office details Found', 'Franchisee Controller: updateFranOfficeDetails')
                        let apiResponse = response.generate(true, 'No Franchisee profile picture Found', 404, null)
                        res.send(apiResponse)
                    } else {

                        let apiResponse = response.generate(false, 'Franchisee profile picture updated', 200, result)
                        res.send(apiResponse)
                        cloudinary.deleteFromCloudinary(req.body.AssetToDelete);
                    }
                });
            }
        });
    } else {
        let apiResponse = response.generate(true, '"FranchiseeId" parameter is missing in the request of profile picture', 400, null)
        res.send(apiResponse);
    }
}
//Profile Picture related Functions END

//Aadhar PDF related Functions
let getAadharPDF = (req, res) => {
    if (check.isEmpty(req.body.FranchiseeId)) {

        console.log('FranchiseeId should be passed')
        let apiResponse = response.generate(true, 'FranchiseeId is missing', 403, null)
        res.send(apiResponse)
    } else {

        AadharModel.findOne({ 'FranchiseeId': req.body.FranchiseeId }, (err, result) => {

            if (err) {
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)

            } else if (check.isEmpty(result)) {

                console.log('Aadhar PDF Not Found.')
                let apiResponse = response.generate(true, 'Aadhar PDF Not Found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info("Aadhar PDF found successfully", "FranchiseeController:getAadharPDF", 5)
                let apiResponse = response.generate(false, 'Aadhar PDF Found Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }
}

let uploadAadhar = (req, res) => {
    if (req.body.FranchiseeId) {
        console.log("req body franId is there");
        console.log(req.body);
        AadharModel.findOne({ "FranchiseeId": req.body.FranchiseeId }, (err, FranchiseeAadharPDFDetails) => {

            /* handle the error here if the Franchisee Aadhar PDF Details details are not found */
            if (err) {
                console.log(err)
                logger.error('Failed To Retrieve Franchisee Aadhar PDF Data', 'FranchiseeController: uploadAadhar()', 10)
                /* generate the error message and the api response message here */
                let apiResponse = response.generate(true, 'Failed To Find Franchisee Aadhar PDF Details', 500, null)
                res.send(apiResponse)

            } else {

                console.log(req.file) // to see what is returned to you

                const file = {};

                file.FranchiseeId = req.body.FranchiseeId;
                file.public_id = req.file.public_id;
                file.url = req.file.url;

                AadharModel.create(file) // save image information in database

                    .then(newFile => res.json(newFile))

                    .catch(
                        err => logger.error(err, 'userController.uploadAadhar()', 8))
            }
        });
    } else {
        let apiResponse = response.generate(true, '"FranchiseeId" parameter is missing in the request uploadAadhar()', 400, null)
        res.send(apiResponse);
    }
}

let updateAadhar = (req, res) => {
    if (req.body.FranchiseeId) {
        console.log("req body franId is there");
        console.log(req.body);

        let toDeleteAssetFromCloudinary = req.body.AssetToDelete;
        console.log("toDeleteAssetFromCloudinary=" + toDeleteAssetFromCloudinary);

        AadharModel.findOne({ FranchiseeId: req.body.FranchiseeId }, (err, FranchiseeAadharPDFDetails) => {

            /* handle the error here if the Franchisee Aadhar PDF Details details are not found */
            if (err) {
                console.log(err)
                logger.error('Failed To Retrieve Franchisee Aadhar PDF Data', 'FranchiseeController: updateAadhar()', 10)
                /* generate the error message and the api response message here */
                let apiResponse = response.generate(true, 'Failed To Find Franchisee Aadhar PDF Details', 500, null)
                res.send(apiResponse)

            } else if (check.isEmpty(FranchiseeProfilePictureDetails)) {
                console.log('Aadhar PDF Not Found.')
                let apiResponse = response.generate(true, 'Aadhar PDF Not Found', 404, null)
                res.send(apiResponse)

            } else if (!check.isEmpty(FranchiseeProfilePictureDetails)) {

                let options = req.file;

                console.log(req.file) // to see what is returned to you                

                AadharModel.updateOne({ 'FranchiseeId': req.body.FranchiseeId }, options).exec((err, result) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'Franchisee Controller:updateAadhar', 10)
                        let apiResponse = response.generate(true, 'Failed To update Franchisee Aadhar PDF', 500, null)
                        res.send(apiResponse)
                    } else if (check.isEmpty(result)) {
                        logger.info('No Franchisee Aadhar PDF details Found', 'Franchisee Controller: updateAadhar')
                        let apiResponse = response.generate(true, 'No Franchisee Aadhar PDF Found', 404, null)
                        res.send(apiResponse)
                    } else {
                        let apiResponse = response.generate(false, 'Franchisee Aadhar PDF updated', 200, result)
                        res.send(apiResponse)
                        cloudinary.deleteFromCloudinary(req.body.AssetToDelete);
                    }
                });
            }
        });
    } else {
        let apiResponse = response.generate(true, '"FranchiseeId" parameter is missing in the request of updateAadhar()', 400, null)
        res.send(apiResponse);
    }
}
//Aadhar PDF related Functions END

//PAN PDF related Functions
let getPanPDF = (req, res) => {

    if (check.isEmpty(req.body.FranchiseeId)) {

        console.log('FranchiseeId should be passed')
        let apiResponse = response.generate(true, 'FranchiseeId is missing', 403, null)
        res.send(apiResponse)
    } else {

        PanModel.findOne({ 'FranchiseeId': req.body.FranchiseeId }, (err, result) => {

            if (err) {
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)

            } else if (check.isEmpty(result)) {

                console.log('Franchisee PAN PDF Not Found.')
                let apiResponse = response.generate(true, 'Franchisee PAN PDF Not Found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info("Franchisee PAN PDF found successfully", "FranchiseeController:getPanPDF", 5)
                let apiResponse = response.generate(false, 'Franchisee PAN PDF Found Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }
}

let uploadpan = (req, res) => {
    if (req.body.FranchiseeId) {
        console.log("req body franId is there");
        console.log(req.body);
        PanModel.findOne({ "FranchiseeId": req.body.FranchiseeId }, (err, FranchiseePanPDFDetails) => {

            /* handle the error here if the Franchisee PAN PDF Details details are not found */
            if (err) {
                console.log(err)
                logger.error('Failed To Retrieve Franchisee PAN PDF Data', 'FranchiseeController: uploadpan()', 10)
                /* generate the error message and the api response message here */
                let apiResponse = response.generate(true, 'Failed To Find Franchisee PAN PDF Details', 500, null)
                res.send(apiResponse)

            } else {

                console.log(req.file) // to see what is returned to you

                const file = {};

                file.FranchiseeId = req.body.FranchiseeId;
                file.public_id = req.file.public_id;
                file.url = req.file.url;

                PanModel.create(file) // save image information in database

                    .then(newFile => res.json(newFile))

                    .catch(
                        err => logger.error(err, 'userController.uploadpan()', 8))
            }
        });
    } else {
        let apiResponse = response.generate(true, '"FranchiseeId" parameter is missing in the request uploadpan()', 400, null)
        res.send(apiResponse);
    }
}

let updatepan = (req, res) => {
    if (req.body.FranchiseeId) {
        console.log("req body franId is there");
        console.log(req.body);

        let toDeleteAssetFromCloudinary = req.body.AssetToDelete;
        console.log("toDeleteAssetFromCloudinary=" + toDeleteAssetFromCloudinary);

        PanModel.findOne({ FranchiseeId: req.body.FranchiseeId }, (err, FranchiseePanPDFDetails) => {

            /* handle the error here if the Franchisee Aadhar PDF Details details are not found */
            if (err) {
                console.log(err)
                logger.error('Failed To Retrieve Franchisee PAN PDF Data', 'FranchiseeController: updatepan()', 10)
                /* generate the error message and the api response message here */
                let apiResponse = response.generate(true, 'Failed To Find Franchisee PAN PDF Details', 500, null)
                res.send(apiResponse)

            } else if (check.isEmpty(FranchiseeProfilePictureDetails)) {
                console.log('PAN PDF Not Found.')
                let apiResponse = response.generate(true, 'PAN PDF Not Found', 404, null)
                res.send(apiResponse)

            } else if (!check.isEmpty(FranchiseeProfilePictureDetails)) {

                let options = req.file;

                console.log(req.file) // to see what is returned to you                

                AadharModel.updateOne({ 'FranchiseeId': req.body.FranchiseeId }, options).exec((err, result) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'Franchisee Controller:updateAadhar', 10)
                        let apiResponse = response.generate(true, 'Failed To update Franchisee PAN PDF', 500, null)
                        res.send(apiResponse)
                    } else if (check.isEmpty(result)) {
                        logger.info('No Franchisee PAN PDF details Found', 'Franchisee Controller: updatepan')
                        let apiResponse = response.generate(true, 'No Franchisee PAN PDF Found', 404, null)
                        res.send(apiResponse)
                    } else {
                        let apiResponse = response.generate(false, 'Franchisee PAN PDF updated', 200, result)
                        res.send(apiResponse)
                        cloudinary.deleteFromCloudinary(req.body.AssetToDelete);
                    }
                });
            }
        });
    } else {
        let apiResponse = response.generate(true, '"FranchiseeId" parameter is missing in the request of updatepan()', 400, null)
        res.send(apiResponse);
    }
}
//PAN PDF related Functions END

/* END Franchisee Personal Information related functions */


/* Franchisee Office related functions */
let getFranOfficeDetails = (req, res) => {
    if (req.body.FranchiseeId) {
        console.log("req body franId is there");
        console.log(req.body);
        FranchiseeOfficeModel.findOne({ FranchiseeId: req.body.FranchiseeId }, (err, FranchiseeOfficeDetails) => {

            /* handle the error here if the Franchisee office details are not found */
            if (err) {
                console.log(err)
                logger.error('Failed To Retrieve Franchisee Office Data', 'FranchiseeController: findFranchiseeOfficeDetails()', 10)
                /* generate the error message and the api response message here */
                let apiResponse = response.generate(true, 'Failed To Find Franchisee Office Details', 500, null)
                res.send(apiResponse)
                /* if Company Details is not found */

            } else if (check.isEmpty(FranchiseeOfficeDetails)) {

                /* generate the response and the console error message here */
                logger.error('No Franchisee Office details Found', 'FranchiseeController: findFranchiseeOfficeDetails()', 7)
                let apiResponse = response.generate(true, 'No Franchisee Office Details Found', 404, null)
                res.send(apiResponse)

            } else {

                /* prepare the message and the api response here */
                logger.info('Franchisee Office details Found', 'FranchiseeController: findFranchiseeOfficeDetails()', 10)
                let apiResponse = response.generate(false, 'Franchisee Office Details Found', 200, FranchiseeOfficeDetails)
                res.send(apiResponse);
            }
        });
    } else {

        let apiResponse = response.generate(true, '"FranchiseeId" parameter is missing in the request of office details', 400, null)
        res.send(apiResponse);
    }
}

let franOfficeDetails = (req, res) => {

    let validateFranOfficeAddInput = () => {

        return new Promise((resolve, reject) => {

            if (check.isEmpty(req.body.FranchiseeId)) {

                let apiResponse = response.generate(true, 'Franchisee Id is missing', 400, null);
                reject(apiResponse);

            } else
                resolve(req);
        });
    }

    let AddFranchiseeOfficeDetails = () => {

        return new Promise((resolve, reject) => {

            FranchiseeOfficeModel.findOne({ FranchiseeId: req.body.FranchiseeId })
                .exec((err, retrievedFranchiseeDetails) => {

                    if (err) {
                        logger.error(err.message, 'FranchiseeController.franOfficeDetails.AddFranchiseeBankDetails()', 10);
                        let apiResponse = response.generate(true, 'Operation Failed', 500, null);
                        reject(apiResponse)

                    } else if (check.isEmpty(retrievedFranchiseeDetails)) {

                        console.log(req.body);

                        let FranchiseeOffice = new FranchiseeOfficeModel({
                            FranchiseeId: req.body.FranchiseeId,
                            franOffName: req.body.franOffName,
                            OffType: req.body.OffType,
                            OffNumber: req.body.OffNumber,
                            OfficeAddress: req.body.OfficeAddress,
                            Officecity: req.body.Officecity,
                            Officetaluka: req.body.Officetaluka,
                            Officedistrict: req.body.Officedistrict,
                            OfficepinCode: req.body.OfficepinCode,
                            OfficeState: req.body.OfficeState,
                            created_on: time.now(),
                            modified_on: time.now()
                        });

                        FranchiseeOffice.save((err, newFranchiseeOffice) => {

                            if (err) {

                                logger.error(err.message, 'FranchiseeController.signUpFunction().createFranchisee()', 10)
                                let apiResponse = response.generate(true, 'Failed to add Franchisee Bank Details', 500, null)
                                reject(apiResponse)

                            } else {

                                let newFrancOfficeObj = newFranchiseeOffice.toObject();
                                resolve(newFrancOfficeObj)
                            }
                        });

                    } else {

                        logger.error('Franchisee Office details cannot be added. Frachisee office details are already present.', 'FranchiseeController.signUpFunction().createFranchisee()', 4)
                        let apiResponse = response.generate(true, 'Frachisee office details are already present.', 403, null);
                        reject(apiResponse);
                    }
                });
        });
    }

    validateFranOfficeAddInput(req, res)
        .then(AddFranchiseeOfficeDetails)
        .then((resolve) => {

            delete resolve.password
            let apiResponse = response.generate(false, 'Franchisee created sucessfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {

            logger.error(err.message, 'FranchiseeController.signUpFunction.catchBlock', 10);
            let apiResponse = response.generate(true, 'Franchisee creation failed', 500, null)
            res.send(apiResponse);
        })
}

let updateofficeDetails = (req, res) => {
    let options = req.body;

    options.modified_on = time.now();

    FranchiseeOfficeModel.updateOne({ 'FranchiseeId': req.body.FranchiseeId }, options).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Franchisee Controller:updateFranOfficeDetails', 10)
            let apiResponse = response.generate(true, 'Failed To edit Franchisee office details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Franchisee Office details Found', 'Franchisee Controller: updateFranOfficeDetails')
            let apiResponse = response.generate(true, 'No Franchisee Office details Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Franchisee office details edited', 200, result)
            res.send(apiResponse)
        }
    });
}
/* END Franchisee Office related functions */


/* Franchisee Bank related functions */
let getFranBankDetails = (req, res) => {
    if (req.body.FranchiseeId) {
        console.log("req body franId is there");
        console.log(req.body);
        FranchiseeBankModel.findOne({ FranchiseeId: req.body.FranchiseeId }, (err, FranchiseeBankDetails) => {

            /* handle the error here if the Franchisee Bank details are not found */
            if (err) {
                console.log(err)
                logger.error('Failed To Retrieve Franchisee Bank Data', 'FranchiseeController: getFranBankDetails()', 10)
                /* generate the error message and the api response message here */
                let apiResponse = response.generate(true, 'Failed To Find Franchisee Bank Details', 500, null)
                res.send(apiResponse)
                /* if Bank Details is not found */

            } else if (check.isEmpty(FranchiseeBankDetails)) {

                /* generate the response and the console error message here */
                logger.error('No Franchisee Bank details Found', 'FranchiseeController: getFranBankDetails()', 7)
                let apiResponse = response.generate(true, 'No Franchisee Bank details Found', 404, null)
                res.send(apiResponse)

            } else {

                /* prepare the message and the api response here */
                logger.info('Franchisee Bank details Found', 'FranchiseeController: getFranBankDetails()', 10)
                let apiResponse = response.generate(false, 'Franchisee Bank Details Found', 200, FranchiseeBankDetails)
                res.send(apiResponse);
            }
        });
    } else {

        let apiResponse = response.generate(true, '"FranchiseeId" parameter is missing in the request of bank details', 400, null)
        res.send(apiResponse);
    }
}

let franbankDetails = (req, res) => {

    let validateFranBankAddInput = () => {

        return new Promise((resolve, reject) => {

            if (check.isEmpty(req.body.FranchiseeId)) {

                let apiResponse = response.generate(true, 'Franchisee Id is missing', 400, null);
                reject(apiResponse);

            } else
                resolve(req);
        });
    }

    let AddFranchiseeBankDetails = () => {
        return new Promise((resolve, reject) => {
            FranchiseeBankModel.findOne({ FranchiseeId: req.body.FranchiseeId })
                .exec((err, retrievedFranchiseeDetails) => {

                    if (err) {
                        logger.error(err.message, 'FranchiseeController.franOfficeDetails.AddFranchiseeBankDetails()', 10);
                        let apiResponse = response.generate(true, 'Operation Failed', 500, null);
                        reject(apiResponse)
                    } else if (check.isEmpty(retrievedFranchiseeDetails)) {

                        console.log(req.body);

                        let FranchiseeBank = new FranchiseeBankModel({
                            FranchiseeId: req.body.FranchiseeId,
                            Account_Number: req.body.Account_Number,
                            Account_Type: req.body.Account_Type,
                            Bank_Name: req.body.Bank_Name,
                            Branch_Name: req.body.Branch_Name,
                            IFSC: req.body.IFSC,
                            Branch_Address: req.body.Branch_Address,
                            Bank_City: req.body.Bank_City,
                            Bank_Taluka: req.body.Bank_Taluka,
                            Bank_District: req.body.Bank_District,
                            Bank_PinCode: req.body.Bank_PinCode,
                            Bank_State: req.body.Bank_State,
                            created_on: time.now(),
                            modified_on: time.now()
                        });

                        FranchiseeBank.save((err, newFranchiseeBank) => {

                            if (err) {

                                logger.error(err.message, 'FranchiseeController.signUpFunction().createFranchisee()', 10)
                                let apiResponse = response.generate(true, 'Failed to add Franchisee Bank Details', 500, null)
                                reject(apiResponse)

                            } else {

                                let newFrancBankObj = newFranchiseeBank.toObject();
                                resolve(newFrancBankObj)
                            }
                        });

                    } else {

                        logger.error('Franchisee Bank details cannot be added. Frachisee bank details are already present.', 'FranchiseeController.signUpFunction().createFranchisee()', 4)
                        let apiResponse = response.generate(true, 'Frachisee bank details are already present.', 403, null);
                        reject(apiResponse);
                    }
                })
        })
    }

    validateFranBankAddInput(req, res)
        .then(AddFranchiseeBankDetails)
        .then((resolve) => {
            delete resolve.password
            let apiResponse = response.generate(false, 'Franchisee created sucessfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            logger.error(err.message, 'FranchiseeController.signUpFunction.catchBlock', 10);
            let apiResponse = response.generate(true, 'Franchisee creation failed', 500, null)
            res.send(apiResponse);
        })
}

let updatebankDetails = (req, res) => {
    let options = req.body;

    options.modified_on = time.now();

    FranchiseeBankModel.updateOne({ 'FranchiseeId': req.body.FranchiseeId }, options).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Franchisee Controller:updatebankDetails', 10)
            let apiResponse = response.generate(true, 'Failed To edit Franchisee bank details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Franchisee Office details Found', 'Franchisee Controller: updatebankDetails')
            let apiResponse = response.generate(true, 'No Franchisee Bank details Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Franchisee bank details edited', 200, result)
            res.send(apiResponse)
        }
    });
}
/* END Franchisee Bank related functions */

module.exports = {

    loginFunction: loginFunction,
    getFranchiseeById: getFranchiseeById,
    logout: logout,

    signUpFunction: signUpFunction,
    franchAdditionalDetails: franchAdditionalDetails,

    getProfilePicture: getProfilePicture,
    uploadProfilePic: uploadProfilePic,
    updateProfilePic: updateProfilePic,

    getAadharPDF: getAadharPDF,
    uploadAadhar: uploadAadhar,
    updateAadhar: updateAadhar,

    getPanPDF: getPanPDF,
    uploadpan: uploadpan,
    updatepan: updatepan,

    getFranOfficeDetails: getFranOfficeDetails,
    franOfficeDetails: franOfficeDetails,
    updateOfficeDetails: updateofficeDetails,

    getFranBankDetails: getFranBankDetails,
    franbankDetails: franbankDetails,
    updatebankDetails: updatebankDetails
}