import nodemailer from 'nodemailer';

function send_email(request, response) {
    const { election_id, elector } = request.body;

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
        to: elector.email,
        subject: 'Jeton de vote',
        text: `Bonjour ${elector.first_name} ${elector.name} ! Vous venez de recevoir votre jeton de vote pour l'élection qui vient de débuter.Vous devrez le saisir pour confirmer chaque vote que vous ferez. Conservez le bien. | Jeton de vote : ${elector.token_for_vote} || Lien du vote : ${process.env.VOTE_WEB_SITE}/choose_your_candidate/${election_id}`,
    };

    transporter.sendMail(mailOptions, function (error, data) {
        if (error) {
            return response.status(500).json({ error });
        } else {
            return response
                .status(200)
                .json({ message: 'Email sent successfully', data });
        }
    });

}

export { send_email };
