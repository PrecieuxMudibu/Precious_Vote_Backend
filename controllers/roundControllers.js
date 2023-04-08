import Round from '../models/roundModel.js';
import Elector from '../models/electorModel.js';
import { send_email_to } from '../event/email.js';

function get_election_id_of_this(round) {
    const election_id = round.post_id.election_id;
    return election_id;
}

function get_emails(electors) {
    let electors_emails = [];
    for (let i = 0; i < electors.length; i++) {
        let current_elector = electors[i];
        electors_emails.push(current_elector.email);
    }
    return electors_emails;
}

function create_round(request, response, next) {
    const { number, status, election_id } = request.body;

    const round = new Round({
        election_id: election_id,
        number: number,
        status: status,
    });

    round
        .save()
        .then((round) =>
            response.status(201).json({
                message: 'Un nouveau round a été créé avec succès.',
                round,
            })
        )
        .catch((error) => response.status(400).json({ error }));
}

function start_round(request, response, next) {
    const { round_id } = request.body;

    const filter = { _id: round_id };
    const update = { status: 'In progress', begin_date: Date.now() };

    Round.findOneAndUpdate(filter, update)
        .populate('post_id')
        .then((round) => {
            // response.status(200).json({
            //     message: 'Le round a commencé.',
            //     round,
            // })
            const election_id = get_election_id_of_this(round);

            Elector.find({ election_id: election_id }).then((electors) => {
                let electors_emails = get_emails(electors);

                for (let i = 0; i < electors_emails.length; i++) {
                    const current_elector_email = electors_emails[0];
                    send_email_to(
                        current_elector_email,
                        'Jeton de vote',
                        'Hello'
                    );
                }

                console.log('electors_emails 1>>>', electors_emails);
            });

            // GET ELECTION ID OF THIS POST

            // {
            //     _id: new ObjectId("64313d858f49528385eb03b3"),
            //     post_id: new ObjectId("64313d838f49528385eb03a8"),
            //     number: 1,
            //     status: 'Not started',
            //     createdAt: 2023-04-08T10:10:13.115Z,
            //     updatedAt: 2023-04-08T10:10:13.115Z,
            //     __v: 0
            //   }

            // RETRIEVE ALL ELECTORS

            // SEND THEM THEIR CODE BY EMAIL
        })
        .catch((error) => response.status(400).json({ error }));
}

function close_round(request, response, next) {
    const { round_id } = request.body;

    const filter = { _id: round_id };
    const update = { status: 'Completed', end_date: Date.now() };

    Round.findOneAndUpdate(filter, update)
        .then((round) =>
            response.status(200).json({
                message: 'Le round est terminé.',
                round,
            })
        )
        .catch((error) => response.status(400).json({ error }));
}
export { create_round, start_round, close_round };
