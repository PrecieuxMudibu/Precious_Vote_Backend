import Candidate from '../models/candidateModel.js';
import ElectorCandidateRound from '../models/electorCandidateRoundModel.js';

function get_candidates(request, response, next) {
    const { election_id, post_id } = request.params;

    const query = { election_id: election_id, post_id: post_id };

    Candidate.find(query)
        .then((users) => response.status(200).json({ users }))
        .catch((error) => response.status(500).json({ error }));
}

function vote_candidate(request, response) {
    const { candidate_id, elector_id, round_id } = request.body;

    const vote = new ElectorCandidateRound({
        candidate_id: candidate_id,
        elector_id: elector_id,
        round_id: round_id,
    });

    vote.save()
        .then((vote) => response.status(201).json({ vote }))
        .catch((error) => response.status(500).json({ error }));
}
export { get_candidates, vote_candidate };
