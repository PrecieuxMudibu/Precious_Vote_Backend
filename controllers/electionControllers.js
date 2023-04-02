import Election from '../models/electionModel.js';

function create_election(request, response, next) {
    const {
        user_id,
        name,
        description,
        begin_date,
        end_date,
        first_round_eligibility_criteria,
    } = request.body;

    const election = new Election({
        user_id: user_id,
        name: name,
        description: description,
        begin_date: begin_date,
        end_date: end_date,
        first_round_eligibility_criteria: first_round_eligibility_criteria,
    });

    election
        .save()
        .then((election) => {
            console.log('election._id>>>>', election._id);
            return response.status(201).json({
                message: 'Votre élection a été créée avec succès.',
                election,
            });
        })
        .catch((error) => response.status(400).json({ error }));
}

export { create_election };
