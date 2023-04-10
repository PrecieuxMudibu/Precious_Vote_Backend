import ElectorCandidateRound from '../models/electorCandidateRoundModel.js';

function get_history_of_ElectorCandidateRound(request, response) {
    const { round_id } = request.params;

    const query = { round_id: round_id };

    ElectorCandidateRound.find(query)
        .populate({ path: 'elector_id', select: ['name', 'first_name'] })
        .populate({ path: 'candidate_id', select: ['name', 'first_name'] })
        .populate('round_id', 'number')
        .then((electorCandidateRound) =>
            response.status(200).json({ electorCandidateRound })
        )
        .catch((error) => response.status(500).json({ error }));
}

function delete_all_ElectorCandidateRound(request, response) {
    ElectorCandidateRound.deleteMany()
        .then(() =>
            response({
                message: 'TOus les electorCandidateRound ont été supprimés',
            })
        )
        .catch((error) => response.json(error));
}

export {
    get_history_of_ElectorCandidateRound,
    delete_all_ElectorCandidateRound,
};
