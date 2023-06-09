import Candidate from '../models/candidateModel.js';
import CandidateRound from '../models/candidateRoundModel.js';
import ElectorCandidateRound from '../models/electorCandidateRoundModel.js';
import Round from '../models/roundModel.js';
import Elector from '../models/electorModel.js';

function get_all_candidates_for_the_post(request, response, next) {
    const { post_id } = request.params;

    const query = { post_id: post_id };

    Candidate.find(query)
        .then((candidates) => response.status(200).json({ candidates }))
        .catch((error) => response.status(500).json({ error }));
}

async function vote_candidate(request, response) {
    const { candidate_id, token_for_vote } = request.body;

    try {
        const elector = await Elector.findOne({
            token_for_vote,
        });

        if (elector == null) {
            return response
                .status(404)
                .json({ message: 'Aucun électeur trouvé avec ce token' });
        } else {
            const candidate_to_vote = await Candidate.findOne({
                _id: candidate_id,
            });
            if (candidate_to_vote == null) {
                return response.status(404).json({
                    message: 'Aucun candidat trouvé avec cet id',
                });
            } else {
                const rounds_for_this_post = await Round.find({
                    post: candidate_to_vote.post,
                })
                    .populate({
                        path: 'post',
                    })
                    .populate({ path: 'candidates' });

                console.log('rounds_for_this_post', rounds_for_this_post);

                rounds_for_this_post.forEach((candidate) => {
                    console.log('candidate ICI', candidate);
                    const { name, email, roundNumber } = candidate; // Codes ici
                });
                const round_1 = rounds_for_this_post.filter(
                    (round) => round.number == 1
                )[0];

                const round_2 = rounds_for_this_post.filter(
                    (round) => round.number == 2
                )[0];

                if (round_1.status === 'In progress') {
                    // SAVE THE VOTE
                    const this_vote_exists = await ElectorCandidateRound.find({
                        elector: elector._id,
                        round: round_1._id,
                    });
                    if (this_vote_exists.length == 0) {
                        const vote = new ElectorCandidateRound({
                            elector: elector._id,
                            candidate: candidate_to_vote._id,
                            round: round_1._id,
                        });
                        // TO DO : SAVED THE VOTE
                        vote.save(vote)
                            .then((vote) => {
                                // const round
                                console.log(3);
                                // CandidateRound.findOneAndUpdate(
                                //     {
                                //         candidate_id: candidate._id,
                                //         round_id: round_1._id,
                                //     },
                                //     {
                                //         $inc: {
                                //             voices: 1,
                                //         },
                                //     },
                                //     {
                                //         new: true,
                                //     }
                                // )
                                //     .then(() =>
                                //         response.status(201).json({
                                //             message:
                                //                 'Votre vote a été enregistré avec succès',
                                //         })
                                //     )
                                //     .catch((error) =>
                                //         response.status(500).json({
                                //             error,
                                //         })
                                // );
                                // }
                            })
                            .catch((error) =>
                                response.status(500).json({ error })
                            );
                    } else {
                        // THE ELECTOR HAS VOTED BEFORE FOR  THIS ROUND AND THIS POST
                        return response.status(200).json({
                            message: 'Vous avez déjà voté',
                        });
                    }
                } else {
                    //  Code 403 : Access refused
                    response.status(403).json({
                        message:
                            "Vous ne pouvez pas voter. Le round 1 est soit terminé, soit il n'a pas encore commencé.",
                    });
                }
            }
        }
    } catch (error) {
        return response.status(400).json({ error });
    }

    // Elector.findOne({ token_for_vote: token_for_vote })
    //     .then((elector) => {
    //         if (elector == null) {
    //             return response
    //                 .status(404)
    //                 .json({ message: 'Aucun électeur trouvé avec ce token' });
    //         } else {
    //             Candidate.findOne({ _id: candidate_id })
    //                 .then((candidate) => {
    //                     if (candidate == null) {
    //                         return response.status(404).json({
    //                             message: 'Aucun candidat trouvé avec cet id',
    //                         });
    //                     } else {
    //                         Round.find({ post_id: candidate.post_id })
    //                             .then((rounds) => {
    //                                 let round_1 = rounds.filter(
    //                                     (round) => round.number == 1
    //                                 );
    //                                 round_1 = round_1[0];

    //                                 let round_2 = rounds.filter(
    //                                     (round) => round.number == 2
    //                                 );
    //                                 round_2 = round_2[0];

    //                                 if (round_1.status == 'In progress') {
    //                                     // SAVE THE VOTE
    //                                     ElectorCandidateRound.find({
    //                                         elector_id: elector._id,
    //                                         round_id: round_1._id,
    //                                     })
    //                                         .then((electorCandidateRound) => {
    //                                             // THE ELECTOR DOESN'T VOTE BEFORE FOR  THIS ROUND AND THIS POST

    //                                             if (
    //                                                 electorCandidateRound.length ==
    //                                                 0
    //                                             ) {
    //                                                 const vote =
    //                                                     new ElectorCandidateRound(
    //                                                         {
    //                                                             elector_id:
    //                                                                 elector._id,
    //                                                             candidate_id:
    //                                                                 candidate._id,
    //                                                             round_id:
    //                                                                 round_1._id,
    //                                                         }
    //                                                     );
    //                                                 vote.save(vote)
    //                                                     .then((vote) => {
    //                                                         CandidateRound.findOneAndUpdate(
    //                                                             {
    //                                                                 candidate_id:
    //                                                                     candidate._id,
    //                                                                 round_id:
    //                                                                     round_1._id,
    //                                                             },
    //                                                             {
    //                                                                 $inc: {
    //                                                                     voices: 1,
    //                                                                 },
    //                                                             },
    //                                                             {
    //                                                                 new: true,
    //                                                             }
    //                                                         )
    //                                                             .then(() =>
    //                                                                 response
    //                                                                     .status(
    //                                                                         201
    //                                                                     )
    //                                                                     .json({
    //                                                                         message:
    //                                                                             'Votre vote a été enregistré avec succès',
    //                                                                     })
    //                                                             )
    //                                                             .catch(
    //                                                                 (error) =>
    //                                                                     response
    //                                                                         .status(
    //                                                                             500
    //                                                                         )
    //                                                                         .json(
    //                                                                             {
    //                                                                                 error,
    //                                                                             }
    //                                                                         )
    //                                                             );
    //                                                     })
    //                                                     .catch((error) =>
    //                                                         response
    //                                                             .status(500)
    //                                                             .json({ error })
    //                                                     );
    //                                             } else {
    //                                                 // THE ELECTOR HAS VOTED BEFORE FOR  THIS ROUND AND THIS POST
    //                                                 return response
    //                                                     .status(200)
    //                                                     .json({
    //                                                         message:
    //                                                             'Vous avez déjà voté',
    //                                                     });
    //                                             }
    //                                         })
    //                                         .catch((error) =>
    //                                             response
    //                                                 .status(500)
    //                                                 .json({ error })
    //                                         );
    //                                 } else {
    //                                     //  Code 403 : Access refused
    //                                     response.status(403).json({
    //                                         message:
    //                                             "Vous ne pouvez pas voter. Le round 1 est soit terminé, soit il n'a pas encore commencé.",
    //                                     });
    //                                 }
    //                             })
    //                             .catch((error) =>
    //                                 response.status(500).json({ error })
    //                             );
    //                     }
    //                 })
    //                 .catch((error) => response.status(500).json({ error }));
    //         }
    //     })
    //     .catch((error) => response.status(500).json({ error }));
}
export { get_all_candidates_for_the_post, vote_candidate };
