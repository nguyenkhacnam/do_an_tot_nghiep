const jwt = require('jsonwebtoken');
const SendResponse = require('../utils/SendResponse');

function authenToken(req, res, next) {
    const authorizationHeader = req.headers['x-access-token'];
    const token = authorizationHeader;

    if (!token) {
        SendResponse("Please put token with your high-level request!", 401, res)
        return;
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        console.log('accept token')
        if (err) {
            SendResponse("Expired or incorrect token!", 401, res)
            return;
        }
        next();
    })
}
module.exports = {authenToken}