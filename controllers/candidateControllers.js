import Candidate from '../models/candidateModel.js';

function get_candidates(request, response, next) {
    const { election_id, post_id } = request.params;

    const query = { election_id: election_id, post_id: post_id };
    Candidate.find(query)
        .then((users) => response.status(200).json({ users }))
        .catch((error) => response.status(400).json({ error }));
}

export { get_candidates };
