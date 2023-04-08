import Round from '../models/roundModel.js';

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
        .then((round) =>
            response.status(200).json({
                message: 'Le round a commencé.',
                round,
            })
        )
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
