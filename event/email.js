import nodemailer from 'nodemailer';

async function send_email_to(elector_email, subject, message) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        },
    });

    const mailOptions = {
        from: 'mudibuprecieux@gmail.com',
        to: elector_email,
        subject: subject,
        text: message,
    };

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log('Error>> ' + err);
        } else {
            console.log('Email sent successfully');
        }
    });
}

export { send_email_to };
