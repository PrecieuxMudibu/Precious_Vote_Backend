import CandidateRound from '../models/candidateRoundModel.js';

function get_candidates_for_the_round(request, response) {
    const { round_id } = request.params;

    const query = { round_id: round_id };

    CandidateRound.find(query)
        .populate('round_id')
        .populate('candidate_id')
        .then((candidates) => response.status(200).json({ candidates }))
        .catch((error) =>
            response.status(500).json({ message: 'Erreur (((', error: error })
        );
}

export { get_candidates_for_the_round };
