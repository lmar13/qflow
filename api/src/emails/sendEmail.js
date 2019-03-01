const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');

// module.exports = (mailOptions, res) => transporter.sendMail(mailOptions, (err) => err ? res.status(500).json({
//     info: 'Something went wrong',
//     err
// }) : res.status(200).json({
//     info: 'An email has been sent to ' + user.email,
//     token
// }));

module.exports = (data) => {
    const {
        req,
        res,
        token,
        user,
        confirm
    } = data;

    const transporter = nodemailer.createTransport({
        host: 'mailhub.tfn.com',
        port: 25,
        secure: false,
        tls: {
            rejectUnauthorized: false,
        },
    });

    const readHTMLFile = (path, callback) => {
        fs.readFile(path, {
            encoding: 'utf-8'
        }, (err, html) => {
            if (err) {
                throw err;
                callback(err);
            } else {
                callback(null, html);
            }
        });
    };

    readHTMLFile('./src/emails/email-template.html', (err, html) => {
        const template = handlebars.compile(html);
        const link = `${req.get('origin')}/auth/${confirm ? 'activation' : 'reset'}/${token.token}`;
        const replacements = {
            // title: confirm ? '<span style="margin-right: 30px;">WELCOME TO</span>' : '',
            logo: '<img src="cid:logo" width="70"/>',
            subtitle: confirm ? 'WELCOME! We hope you will have<br> an Awesome time!' : `Hello ${user.name} ${user.surname}!<br><br> We are sorry that You forgot Your password. We are here to help You!`,
            info: confirm ? 'We are very excited that you have joined us. Just one click away from activating your account.' : 'Please click button below to reset password. In the next step You will be asked to provide new one.',
            link,
        };
        const htmlToSend = template(replacements);

        const mailOptions = {
            from: 'qflow-no-replay@thomsonreuters.com',
            // to: 'lukasz.marciniak@thomsonreuters.com',
            to: req.body.email,
            subject: confirm ? 'Account activation' : 'Password reset', // Subject line
            text: confirm ? `Hello,\n\n' + 'Please verify your account by clicking the link: \n${link}.\n` : `Please click link below below to reset password. In the next step You will be asked to provide new one \n\n${link}`, // plain text body
            html: htmlToSend, // html body
            attachments: [{
                    filename: 'qflow_blue.png',
                    path: './src/assets/logo/qflow_blue.png',
                    cid: 'logo',
                },
                {
                    filename: 'bg_email_min.png',
                    path: './src/assets/bg_email_min.png',
                    cid: 'bg_email',
                }
            ],
        };

        transporter.sendMail(mailOptions, (err) => err ? res.status(500).json({
            info: 'Something went wrong',
            err
        }) : res.status(200).json({
            info: 'An email has been sent to ' + user.email,
            token
        }));
    });
}