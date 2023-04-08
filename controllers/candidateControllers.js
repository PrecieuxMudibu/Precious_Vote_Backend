import Candidate from '../models/candidateModel.js';
import ElectorCandidateRound from '../models/electorCandidateRoundModel.js';
import Round from '../models/roundModel.js';

function get_candidates(request, response, next) {
    const { election_id, post_id } = request.params;

    const query = { election_id: election_id, post_id: post_id };

    Candidate.find(query)
        .then((users) => response.status(200).json({ users }))
        .catch((error) => response.status(500).json({ error }));
}

function vote_candidate(request, response) {
    const { candidate_id, token_for_vote } = request.body;

    Candidate.findOne({ _id: candidate_id })
        // .then((candidate) => response.status(200).json({ candidate }))
        .then((candidate) => {
            // RETRIEVE ROUNDS FOR THIS POST
            const post_id = candidate.post_id;
            Round.find({ post_id: post_id })
                .then((rounds) => {
                    let round_1 = rounds.filter((round) => round.number == 1);
                    round_1 = round_1[0];
                    let round_2 = rounds.filter((round) => round.number == 2);
                    round_2 = round_2[0];
                })
                .catch((error) => response.status(500).json({ error }));

            // FIND ROUNDS FOR AN ELECTION
        })

        .catch((error) => response.status(500).json({ error }));

    // TODO : ADD A CODE FOR VERIFY IF THE ROUND IS CLOSED

    // If it is finished vote with the second round_id if it exists

    // const vote = new ElectorCandidateRound({
    //     candidate_id: candidate_id,
    //     elector_id: elector_id,
    //     round_id: round_id,
    // });

    // vote.save()
    //     .then((vote) => response.status(201).json({ vote }))
    //     .catch((error) => response.status(500).json({ error }));
}
export { get_candidates, vote_candidate };
