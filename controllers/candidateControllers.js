import Candidate from '../models/candidateModel.js';
import ElectorCandidateRound from '../models/electorCandidateRoundModel.js';
import Round from '../models/roundModel.js';
import Elector from '../models/electorModel.js';

function get_candidates(request, response, next) {
    const { election_id, post_id } = request.params;

    const query = { election_id: election_id, post_id: post_id };

    Candidate.find(query)
        .then((users) => response.status(200).json({ users }))
        .catch((error) => response.status(500).json({ error }));
}

function vote_candidate(request, response) {
    const { candidate_id, token_for_vote } = request.body;

    Elector.findOne({ token_for_vote: token_for_vote })
        .then((elector) => {
            if (elector == null) {
                return response
                    .status(404)
                    .json({ message: 'Aucun électeur trouvé avec ce token' });
            } else {
                // return response.status(200).json({ elector });
                Candidate.findOne({ _id: candidate_id })
                    .then((candidate) => {
                        if (candidate == null) {
                            return response.status(404).json({
                                message: 'Aucun candidat trouvé avec cet id',
                            });
                        } else {
                            // RETRIEVE ROUNDS FOR THIS POST
                            Round.find({ post_id: candidate.post_id })
                                .then((rounds) => {
                                    let round_1 = rounds.filter(
                                        (round) => round.number == 1
                                    );
                                    round_1 = round_1[0];

                                    let round_2 = rounds.filter(
                                        (round) => round.number == 2
                                    );
                                    round_2 = round_2[0];

                                    if (round_1.status == 'In progress') {
                                        // SAVE THE VOTE
                                        ElectorCandidateRound.find({
                                            elector_id: elector._id,
                                            round_id: round_1._id,
                                        })
                                            .then((electorCandidateRound) => {
                                                // THE ELECTOR DOESN'T VOTE BEFORE FOR  THIS ROUND AND THIS POST
                                                if (
                                                    electorCandidateRound ==
                                                    null
                                                ) {
                                                    const vote =
                                                        new ElectorCandidateRound(
                                                            {
                                                                elector_id:
                                                                    elector._id,
                                                                candidate_id:
                                                                    candidate._id,
                                                                round_id:
                                                                    round_1._id,
                                                            }
                                                        );
                                                    vote.save(vote)
                                                        .then((vote) =>
                                                            response
                                                                .status(201)
                                                                .json({
                                                                    message:
                                                                        'Votre vote a été enregistré avec succès',
                                                                })
                                                        )
                                                        .catch((error) =>
                                                            response
                                                                .status(500)
                                                                .json({ error })
                                                        );
                                                } else {
                                                    // THE ELECTOR HAS VOTED BEFORE FOR  THIS ROUND AND THIS POST
                                                    return response
                                                        .status(200)
                                                        .json({
                                                            message:
                                                                'Vous avez déjà voté',
                                                        });
                                                }
                                            })
                                            .catch((error) =>
                                                response
                                                    .status(500)
                                                    .json({ error })
                                            );
                                    } else {
                                        //  Code 403 : Access refused
                                        response.status(403).json({
                                            message:
                                                "Vous ne pouvez pas voter. Le round 1 est soit terminé, soit il n'a pas encore commencé.",
                                        });
                                    }
                                })
                                .catch((error) =>
                                    response.status(500).json({ error })
                                );
                        }
                    })
                    .catch((error) => response.status(500).json({ error }));
            }
        })
        .catch((error) => response.status(500).json({ error }));
}
export { get_candidates, vote_candidate };
