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

    // transporter
    //     .sendMail(mailOptions)
    //     .then((data) =>
    //         response.status(500).json({
    //             message: 'Le message est envoyé.',
    //         })
    //     )
    //     .catch((error) =>
    //         response.status(400).json({
    //             message: "Le message n'a pas été envoyé est terminé.",
    //             errorFInal: error,
    //         })
    //     );
}

async function send_emails_to_all(request, response, next) {
    const { electors } = request.body;

    for (let i = 0; i < electors.length; i++) {
        const current_elector = electors[i];

        await send_email_to(
            current_elector.email,
            'Jeton de vote',
            `Bonjour ${current_elector.first_name} ${current_elector.name} ! Vous venez de recevoir votre jeton de vote pour l'élection qui vient de débuter.Vous devrez le saisir pour confirmer chaque vote que vous ferez. Conservez le bien. | Jeton de vote : ${current_elector.token_for_vote} || Lien du vote : ${process.env.VOTE_WEB_SITE}/choose_your_candidate/6443cadfbf58379ac1b03042`
        );
    }

    return response.status(200).json({
        message: 'Les mails ont été envoyés avec succès.',
    });
}

export { send_emails_to_all };
