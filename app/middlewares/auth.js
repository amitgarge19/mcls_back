const logger = require('./../libs/loggerLib')
const responseLib = require('./../libs/responseLib')
const token = require('./../libs/tokenLib')
const check = require('./../libs/checkLib')
const mongoose = require('mongoose')

const Auth = mongoose.model('Auth')

let isAuthorized = (req, res, next) => {
    if (req.params.authToken || req.query.authToken || req.body.authToken || req.header('authToken')) {
        Auth.findOne({ authToken: req.header('authToken') || req.params.authToken || req.body.authToken || req.query.authToken }, (err, authDetails) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'AuthorizationMiddleware', 10)
                let apiResponse = responseLib.generate(true, 'Failed To Authorized', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(authDetails)) {
                logger.error('No Authorization Key Is Present in auth Table', 'AuthorizationMiddleware', 10)
                let apiResponse = responseLib.generate(true, 'Invalid Or Expired Authorization Key', 404, null)
                res.send(apiResponse)
            } else {
                token.verifyToken(authDetails.authToken, authDetails.tokenSecret, (err, decoded) => {

                    if (err) {
                        logger.error(err.message, 'Authorization Middleware', 10)
                        let apiResponse = responseLib.generate(true, 'Failed To Authorize', 500, null)
                        res.send(apiResponse)
                    }
                    else {

                        req.user = { userId: decoded.data.userId }
                        next()
                    }
                });// end verify token
            }
        })
    } else {
        logger.error('Authorization Token Missing', 'AuthorizationMiddleware', 5)
        let apiResponse = responseLib.generate(true, 'Authorization Token Is Missing In Request', 403, null)
        res.send(apiResponse)
    }
}

let whatUserType = (req, res, next) => {
    if (req.header('userType') === 'SuperUser' || req.header('userType') === 'Admin' || req.params.userType === 'SuperUser' || req.params.userType === 'Admin' || req.query.userType === 'SuperUser' || req.query.userType === 'Admin' || req.body.userType === 'SuperUser' || req.body.userType === 'Admin') {
        next();
    } else {
        logger.error('Un-Authorized Access', 'AuthorizationMiddleware.whatUserType()', 5)
        let apiResponse = responseLib.generate(true, 'Un-Authorized Access', 403, null)
        res.send(apiResponse)
    }
}

module.exports = {
    isAuthorized: isAuthorized,
    whatUserType: whatUserType
}