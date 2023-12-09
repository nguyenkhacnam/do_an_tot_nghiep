const JWTRefTokens = require('../models/token.model.mongodb')
const db = require("../models");
const Account = db.account;
const jwt = require('jsonwebtoken')
const aes256 = require('aes256');

exports.login = (req, res) => {
    const data = req.body;

    Account.findOne({ where: { email: req.body.email } })
        .then(result => {
            if (result == null) {
                console.log('Not found!');
                res.send("Login failed! Account doesn't existed!")
            } else {
                if (aes256.decrypt(process.env.SECRET_KEY_HASH, result.password).toString() == req.body.password) {
                    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
                    const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
                    //// Update refreshTokens into database
                    // console.log(refreshToken)
                    JWTRefTokens.findByIdAndUpdate('6220d47b4f634bc99c65b32a',
                        { "$push": { "refreshTokens": refreshToken } },
                        { "new": true, "upsert": true }
                    ).then((data) => {
                        res.status(200) 
                        res.json({ accessToken, refreshToken });

                    })
                        .catch(err => console.log(err))
                }
                else {
                    res.send("Password is incorrect!")
                }
                
            }
        })
        .catch(err => res.send(err))



}
exports.RefreshToken = (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken) {
        res.sendStatus(401);
        return;
    }

    JWTRefTokens.find({})
        .then(data => {
            let refreshTokens = [];
            refreshTokens = data[0].refreshTokens
            if (!refreshTokens.includes(refreshToken)) {
                res.sendStatus(401);
                return;
            }

            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
                if (err) {
                    res.sendStatus(401);
                    return;
                }
                console.log('refreshtoken')
                const accessToken = jwt.sign({ username: data.username },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '30s' }
                );
                res.json({ accessToken });
            })
        })
        .catch(err => console.log(err))


}
exports.logout = (req, res) => {
    const refreshToken = req.body.token;
    JWTRefTokens.find({})
        .then(data => {
            let refreshTokens = [];
            refreshTokens = data[0].refreshTokens
            refreshTokens = refreshTokens.filter((refToken) => refToken !== refreshToken);
            ///update Update refreshTokens into database 
            JWTRefTokens.findByIdAndUpdate('6220d47b4f634bc99c65b32a',
                { "$pull": { "refreshTokens": refreshToken } },
                { "new": true, "upsert": true }
            ).then((data) => {
                res.sendStatus(200)
            })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
}

