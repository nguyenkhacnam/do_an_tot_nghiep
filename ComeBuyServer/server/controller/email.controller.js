var nodemailer = require('nodemailer');
exports.sendVerify = (req, res) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "nguyenkhacnam06052001@gmail.com",
            pass: "wivodmxiudxrymal"
        }
    });

    var mailOptions = {
        from: "nguyenkhacnam06052001@gmail.com",
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.text,
        html:
            `<div style="width:100%">
                <img style="border-radius: 15px; width:300px; background-size:cover; align-self:center" src="https://res.cloudinary.com/dol7hrjxn/image/upload/v1702195524/comebuy/logoremovebg_mewoul_wzakgr.png" alt="" style="width:100%; height:100%" />
                <h4 style="align-self:center">VERIFY EMAIL FROM COMEBUY</h4>
                <p style="font-size: 14px;align-self:center">Use code below to verify </p>
                <h2 style="align-self:center;font-weight: 800">${req.body.text}</h2>
                <h4 style="align-self:center">Thanks for being ComeBuy's member</h4>
        </div>`
    };
    console.log(mailOptions)
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.send(error);
        } else {
            res.send(info.response);
        }
    });
}

exports.sendOrder = (req, res) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "nguyenkhacnam06052001@gmail.com",
            pass: "wivodmxiudxrymal"
        }
    });

    var mailOptions = {
        from: "nguyenkhacnam06052001@gmail.com",
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.text
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.send(error);
        } else {
            res.send(info.response);
        }
    });
}