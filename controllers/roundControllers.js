import Round from '../models/roundModel.js';
import Elector from '../models/electorModel.js';
import { send_email_to } from '../event/email.js';

function get_election_id_of_this(round) {
    const election_id = round.post_id.election_id;
    return election_id;
}

function send_emails_to_all(electors) {
    for (let i = 0; i < electors.length; i++) {
        const current_elector = electors[i];

        send_email_to(
            current_elector.email,
            'Jeton de vote',
            `Bonjour ${current_elector.first_name} ${current_elector.name} ! Vous venez de recevoir votre jeton de vote pour l'élection qui vient de débuter.<br> Vous devrez le saisir pour confirmer chaque vote que vous ferez. <br> Conservez le bien. || <br> Jeton de vote : ${current_elector.token_for_vote}`
        );
    }
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
    const { round_id } = request.params;

    const filter = { _id: round_id };
    const update = { status: 'In progress', begin_date: Date.now() };

    Round.findOneAndUpdate(filter, update)
        .populate('post_id')
        .then((round) => {
            const election_id = get_election_id_of_this(round);

            Elector.find({ election_id: election_id }).then((electors) => {
                send_emails_to_all(electors);

                return response.status(200).json({
                    message:
                        'Le round a commencé et les électeurs on été notifiés.',
                    round,
                });
            });
        })
        .catch((error) => response.status(400).json({ error }));
}

function close_round(request, response, next) {
    const { round_id } = request.params;

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

function get_rounds_for_a_post(request, response) {
    const { post_id } = request.params;

    const query = { post_id: post_id };

    Round.find(query)
        .then((rounds) => response.status(200).json({ rounds }))
        .catch((error) => response.status(500).json({ error }));
}

function delete_all_rounds(request, response) {
    Round.deleteMany()
        .then((rounds) =>
            response({ message: 'TOus les rounds ont été supprimés', rounds })
        )
        .catch((error) => response.json(error));
}

export {
    create_round,
    start_round,
    close_round,
    get_rounds_for_a_post,
    delete_all_rounds,
};
