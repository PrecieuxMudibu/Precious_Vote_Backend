import Round from '../models/roundModel.js';
import Elector from '../models/electorModel.js';
import Election from '../models/electionModel.js';
import CandidateRound from '../models/candidateRoundModel.js';

import { send_email_to } from '../event/email.js';
import { sortArrayDesc } from '../helpers/index.js';
import Post from '../models/postModel.js';

function get_election_id_of_this(round) {
    const election_id = round.post.election;
    return election_id;
}

function create_round(number, post) {
    const round = new Round({
        post_id: post._id,
        number: number,
        status: 'Not started',
    });
    round
        .save()
        .then((round_1) => {})
        .catch((error) => console.log({ [round + ' ' + number]: error }));

    return round;
}

function add_the_candidate_to_the_round(round, candidate_round) {
    const candidateRound = new CandidateRound({
        candidate_id: candidate_round.candidate_id,
        round_id: round._id,
        voices: 0,
    });

    candidateRound
        .save()
        .then((candidateRound) => {})
        .catch((error) => console.log({ candidate: error }));
}

// ---------------------------------- //

function send_emails_to_all(electors) {
    for (let i = 0; i < electors.length; i++) {
        const current_elector = electors[i];

        send_email_to(
            current_elector.email,
            'Jeton de vote',
            `Bonjour ${current_elector.first_name} ${current_elector.name} ! Vous venez de recevoir votre jeton de vote pour l'élection qui vient de débuter.Vous devrez le saisir pour confirmer chaque vote que vous ferez. Conservez le bien. | Jeton de vote : ${current_elector.token_for_vote} || Lien du vote : ${process.env.VOTE_WEB_SITE}/choose_your_candidate/6443cadfbf58379ac1b03042`
        );
    }
}

async function start_round(request, response) {
    const { round_id } = request.params;

    const filter = { _id: round_id };
    const update = { status: 'In progress', begin_date: Date.now() };

    try {
        const round = await Round.findOne(filter);
        console.log('round ICI', round);

        if (round.status === 'Not started') {
            const round_updated = await Round.findOneAndUpdate(filter, update, {
                new: true,
            }).populate('post');

            const election_id = get_election_id_of_this(round_updated);

            //----- TODO : SEND EMAIL TO ALL ELECTORS
            const electors = await Elector.find({ election_id: election_id });
            // send_emails_to_all(electors);
            //----- TODO : SEND EMAIL TO ALL ELECTORS

            return response.status(200).json({
                message:
                    'Le round a commencé et les électeurs on été notifiés.',
                round: round_updated,
            });
        } else {
            if (round.status === 'In progress') {
                return response.status(405).json({
                    message:
                        'Vous ne pouvez pas commencer ce round. Ce round est en cours',
                });
            } else {
                return response.status(405).json({
                    message:
                        'Vous ne pouvez pas commencer ce round. Ce round est terminé',
                });
            }
        }
    } catch (error) {
        return response.status(400).json({ error });
    }
}

async function close_round(request, response) {
    const { round_id } = request.params;
    try {
        const filter = { _id: round_id };
        const update = { status: 'Completed', end_date: Date.now() };
        const round = await Round.findOne(filter);

        if (round && round.status == 'In progress') {
            const round_updated = await Round.findOneAndUpdate(filter, update, {
                new: true,
            })
                .populate({
                    path: 'post',
                    populate: { path: 'election' },
                })
                .populate({ path: 'candidates.candidate' });

            if (round.number === 1) {
                // 1. Récuperer le poste correspondant à ce round
                const post_id_of_the_round_1 = round_updated.post._id;

                // 2. Récuperer l'election correspondant à ce poste
                const election_id_of_this_post =
                    round_updated.post.election._id;

                const election_has_two_rounds =
                    round_updated.post.election.two_rounds;

                if (election_has_two_rounds) {
                    const electors_number = await Elector.countDocuments({
                        election_id: election_id_of_this_post,
                    });

                    // Calcul de l'equivalent du pourcentage des voix en fonctions des electeurs
                    const first_round_eligibility_criteria_voices =
                        (electors_number *
                            round_updated.post.election
                                .first_round_eligibility_criteria) /
                        100;

                    // 3.1. Trouver tous les candidats qui ont obtenu plus de voix que le first_round_eligibility_criteria_voices
                    let candidates_eligibles_for_second_rounds =
                        round_updated.candidates.map((item) => {
                            if (
                                item.voices >= 10
                                // first_round_eligibility_criteria_voices
                            ) {
                                return { ...item._doc, voices: 0 };
                            }
                        });

                    // Delete null element in the array
                    candidates_eligibles_for_second_rounds =
                        candidates_eligibles_for_second_rounds.filter(
                            (item) => item
                        );

                    console.log('ICI', candidates_eligibles_for_second_rounds);

                    if (candidates_eligibles_for_second_rounds.length == 1) {
                        return response.status(200).json({
                            message: `Le round 1 est terminé. Le vainqueur est ${candidates_eligibles_for_second_rounds[0].candidate.first_name} ${candidates_eligibles_for_second_rounds[0].candidate.name}`,
                            round: round_updated,
                        });
                    } else if (
                        candidates_eligibles_for_second_rounds.length == 0
                    ) {
                        const candidates_sorted = sortArrayDesc(
                            round_updated.candidates
                        );
                        // recupérer les premiers candidats en fonction du candidates_for_the_second_round de l'election
                        const first_candidates = candidates_sorted.slice(
                            0,
                            round_updated.post.election
                                .candidates_for_the_second_round
                        );

                        // Create a round 2
                        const round_2 = new Round({
                            post: post_id_of_the_round_1,
                            number: 2,
                            status: 'Not started',
                            candidates: first_candidates,
                        });
                        const round_2_created = await round_2.save();

                        // Add the new round created to his post
                        const post_updated = await Post.findOneAndUpdate(
                            { _id: post_id_of_the_round_1 },
                            {
                                rounds: [
                                    ...round_updated.post.rounds,
                                    round_2_created._id,
                                ],
                            },
                            {
                                new: true,
                            }
                        );

                        return response.status(200).json({
                            message: `Le round 1 est terminé. Aucun candidat n'a réalisé le score requis pour être élu au premier tour. Les ${round_updated.post.election.candidates_for_the_second_round} candidats ayant le plus grand score ont été reconduits au deuxième tour.`,
                            round: round_updated,
                        });

                        console.log('ICI 2', candidates_sorted);
                        console.log('ICI 3', first_candidates);
                    } else {
                        // Create a round 2
                        const round_2 = new Round({
                            post: post_id_of_the_round_1,
                            number: 2,
                            status: 'Not started',
                            candidates: candidates_eligibles_for_second_rounds,
                        });
                        const round_2_created = await round_2.save();

                        return response.status(200).json({
                            message: `Le round 1 est terminé. ${candidates_eligibles_for_second_rounds.length} candidats ont réalisé des scores dépassant le critère d'éligibilité au premier tour. Ces ${candidates_eligibles_for_second_rounds.length} candidats ont été reconduits au deuxième tour.`,
                            round,
                        });
                    }

                    // return response.status(200).json({
                    //     message: `Le round 1 est terminé. Aucun candidat n'a réalisé le score requis pour être élu au premier tour. Les`,
                    //     round_updated,
                    // });

                    // CandidateRound.find({
                    //     round_id: round._id,
                    //     voices: {
                    //         // $gt: 70,
                    //         // $gt: 3,
                    //         $gt: first_round_eligibility_criteria_voices,
                    //     },
                    // })
                    //     .populate('candidate_id')
                    //     .then((candidates_rounds) => {
                    //         // 🚀 S'il y en a un, pas besoin de deuxième round on ne commence pas le deuxième tour pour ce poste
                    //         if (candidates_rounds.length == 1) {
                    //             return response.status(200).json({
                    //                 message: `Le round 1 est terminé. Le vainqueur est ${candidates_rounds[0].candidate_id.first_name} ${candidates_rounds[0].candidate_id.name}`,
                    //                 round,
                    //             });
                    //         }

                    //         // 🚀 S'il n'y en aucun, on récupère les "n" candidats ayant le plus de voix tels que défini dans le "candidates_to_be_retained_in_the_second_round"
                    //         else if (candidates_rounds.length == 0) {
                    //             console.log(
                    //                 'AUCUN CANDIDAT candidates_rounds>>',
                    //                 candidates_rounds
                    //             );
                    //             CandidateRound.find({
                    //                 round_id: round._id,
                    //             })
                    //                 .sort({ voices: -1 }) // Tri décroissant
                    //                 .limit(
                    //                     election.candidates_for_the_second_round
                    //                 ) // Recuperation des n premiers candidats
                    //                 .then((candidates_rounds) => {
                    //                     {
                    //                         let round_2 = create_round(2, {
                    //                             _id: post_id_of_the_round_1,
                    //                         });
                    //                         // // Ajout des n premiers candidats au round 2
                    //                         for (
                    //                             let i = 0;
                    //                             i < candidates_rounds.length;
                    //                             i++
                    //                         ) {
                    //                             const current_candidate =
                    //                                 candidates_rounds[i];
                    //                             add_the_candidate_to_the_round(
                    //                                 round_2,
                    //                                 current_candidate
                    //                             );
                    //                         }
                    //                         return response.status(200).json({
                    //                             message: `Le round 1 est terminé. Aucun candidat n'a réalisé le score requis pour être élu au premier tour. Les ${election.candidates_for_the_second_round} candidats ayant le plus grand score ont été reconduits au deuxième tour.`,
                    //                             round,
                    //                         });
                    //                     }
                    //                 })
                    //                 .catch((error) =>
                    //                     response.status(500).json({ error })
                    //                 );
                    //         }
                    //         // 🚀 S'il y en a deux (ou trois, ou quatre, etc.), on crée le deuxième tour pour ce poste avec ces deux (trois ou quatre) candidats
                    //         else {
                    //             let round_2 = create_round(2, {
                    //                 _id: post_id_of_the_round_1,
                    //             });
                    //             // // Ajout au deuxième round de tous les candidats  qui ont dépassé le first_round_eligibility_criteria_voices
                    //             console.log(
                    //                 'candidates_rounds DEPASSE LE SCORE>>>',
                    //                 candidates_rounds
                    //             );

                    //             for (
                    //                 let i = 0;
                    //                 i < candidates_rounds.length;
                    //                 i++
                    //             ) {
                    //                 const current_candidate =
                    //                     candidates_rounds[i];
                    //                 add_the_candidate_to_the_round(
                    //                     round_2,
                    //                     current_candidate
                    //                 );
                    //             }

                    //             return response.status(200).json({
                    //                 message: `Le round 1 est terminé. ${candidates_rounds.length} candidats ont réalisé des scores dépassant le critère d'éligibilité au premier tour. Ces ${candidates_rounds.length} candidats ont été reconduits au deuxième tour.`,
                    //                 round,
                    //             });
                    //         }
                    //     });
                } else {
                    return response.status(200).json({
                        message: 'Le round est terminé.',
                        round,
                    });
                }
            } else {
                return response.status(200).json({
                    message: 'Le round 2 est terminé.',
                    round: round_updated,
                });
            }

            // return response.status(200).json({
            //     message: `Le round 1 est terminé.`,
            //     round: round_updated,
            // });
        } else {
            return response.status(200).json({
                message:
                    "Vous ne pouvez pas arrêter ce round. Soit il n'a pas encore commencé, soit il est déjà",
                round: round_updated,
            });
        }
    } catch (error) {}
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
