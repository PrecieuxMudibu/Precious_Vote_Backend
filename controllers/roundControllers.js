import Round from '../models/roundModel.js';
import Elector from '../models/electorModel.js';
import Election from '../models/electionModel.js';
import CandidateRound from '../models/candidateRoundModel.js';

import { send_email_to } from '../event/email.js';

function get_election_id_of_this(round) {
    const election_id = round.post_id.election_id;
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
            `Bonjour ${current_elector.first_name} ${current_elector.name} ! Vous venez de recevoir votre jeton de vote pour l'élection qui vient de débuter.<br> Vous devrez le saisir pour confirmer chaque vote que vous ferez. <br> Conservez le bien. || <br> Jeton de vote : ${current_elector.token_for_vote}`
        );
    }
}

function start_round(request, response) {
    const { round_id } = request.params;

    const filter = { _id: round_id };
    const update = { status: 'In progress', begin_date: Date.now() };

    Round.findOneAndUpdate(filter, update, { new: true })
        .populate('post_id')
        .then((round) => {
            const election_id = get_election_id_of_this(round);

            Elector.find({ election_id: election_id }).then((electors) => {
                send_emails_to_all(electors);

                return response.status(200).json({
                    message:
                        'Le round a commencé et les électeurs on été notifiés.',
                    round,
                });
            });
        })
        .catch((error) => response.status(400).json({ error }));
}

function close_round(request, response) {
    const { round_id } = request.params;

    const filter = { _id: round_id };
    const update = { status: 'Completed', end_date: Date.now() };

    Round.findOneAndUpdate(filter, update, { new: true })
        .populate('post_id')
        .then((round) => {
            if (round.number == 1) {
                // 1. Récuperer le poste correspondant à ce round
                const post_id_of_the_round_1 = round.post_id._id;

                // 2. Récuperer l'election correspondant à ce poste
                const election_id_of_this_post = round.post_id.election_id;

                Election.findById(election_id_of_this_post)
                    .then((election) => {
                        const election_has_two_rounds = election.two_rounds;
                        console.log('election>>', election);

                        // 3. Vérifier si two_rouns égal à true
                        if (election_has_two_rounds) {
                            Elector.countDocuments({
                                election_id: election_id_of_this_post,
                            })
                                .then((electors_number) => {
                                    // Calcul de l'equivalent du pourcenta des voix en fonctions des electeurs
                                    let first_round_eligibility_criteria_voices =
                                        (electors_number *
                                            election.first_round_eligibility_criteria) /
                                        100;

                                    // 3.1. Trouver tous les candidats qui ont obtenu plus de voix que le first_round_eligibility_criteria_voices
                                    CandidateRound.find({
                                        round_id: round._id,
                                        voices: {
                                            // $gt: 70,
                                            $gt: 3,
                                            // $gt: first_round_eligibility_criteria_voices,
                                        },
                                    })
                                        .populate('candidate_id')
                                        .then((candidates_rounds) => {
                                            console.log(
                                                'CandidateRound>>',
                                                candidates_rounds
                                            );
                                            // 🚀 S'il y en a un, pas besoin de deuxième round on ne commence pas le deuxième tour pour ce poste
                                            if (candidates_rounds.length == 1) {
                                                return response
                                                    .status(200)
                                                    .json({
                                                        message:
                                                            'Le round est terminé.',
                                                        round,
                                                    });
                                            }

                                            // 🚀 S'il n'y en aucun, on récupère les "n" candidats ayant le plus de voix tels que défini dans le "candidates_to_be_retained_in_the_second_round"
                                            else if (
                                                candidates_rounds.length == 0
                                            ) {
                                                console.log(
                                                    'AUCUN CANDIDAT candidates_rounds>>',
                                                    candidates_rounds
                                                );
                                                CandidateRound.find({
                                                    round_id: round._id,
                                                })
                                                    .sort({ voices: -1 }) // Tri décroissant
                                                    .limit(
                                                        // 3
                                                        election.candidates_for_the_second_round
                                                    ) // Recuperation des n premiers candidats
                                                    .then(
                                                        (candidates_rounds) => {
                                                            {
                                                                console.log(
                                                                    'N PREMIERS candidates_rounds>>',
                                                                    candidates_rounds
                                                                );
                                                                let round_2 =
                                                                    create_round(
                                                                        2,
                                                                        {
                                                                            _id: post_id_of_the_round_1,
                                                                        }
                                                                    );
                                                                // // Ajout des n premiers candidats au round 2
                                                                for (
                                                                    let i = 0;
                                                                    i <
                                                                    candidates_rounds.length;
                                                                    i++
                                                                ) {
                                                                    const current_candidate =
                                                                        candidates_rounds[
                                                                            i
                                                                        ];
                                                                    add_the_candidate_to_the_round(
                                                                        round_2,
                                                                        current_candidate
                                                                    );
                                                                }
                                                            }
                                                        }
                                                    )
                                                    .catch((error) =>
                                                        response
                                                            .status(500)
                                                            .json({ error })
                                                    );
                                            }
                                            // 🚀 S'il y en a deux (ou trois, ou quatre, etc.), on crée le deuxième tour pour ce poste avec ces deux (trois ou quatre) candidats
                                            else {
                                                // TO DO HERE
                                                let round_2 = create_round(2, {
                                                    _id: post_id_of_the_round_1,
                                                });
                                                // // Ajout des tous les candidats  qui ont dépassé le first_round_eligibility_criteria_voices
                                                for (
                                                    let i = 0;
                                                    i <
                                                    candidates_rounds.length;
                                                    i++
                                                ) {
                                                    const current_candidate =
                                                        candidates_rounds[i];
                                                    add_the_candidate_to_the_round(
                                                        round_2,
                                                        current_candidate
                                                    );

                                                    return response
                                                        .status(200)
                                                        .json({
                                                            message: `Le round 1 est terminé. ${candidates_rounds.length} candidats ont réalisé des scores dépassant le critère d'éligibilité au premier tour. Ces ${candidates_rounds.length} candidats ont été reconduits au deuxième tour.`,
                                                            round,
                                                        });
                                                }
                                            }
                                        });
                                })
                                .catch((error) =>
                                    response.status(500).json({ error })
                                );
                        } else {
                            return response.status(200).json({
                                message: 'Le round est terminé.',
                                round,
                            });
                        }
                    })
                    // 1. Vérifier si two_rouns égal à true
                    // Si OUI
                    // 2. Recuperer le "first_round_eligibility_criteria"
                    // 3. Recuperer le "candidates_to_be_retained_in_the_second_round"
                    // 4. Recuperer le nombre d'electeur de l'election get_electors

                    // 5. Calculer le nombre de voix correspondant first_round_eligibility_criteria en faisant >>>>  (first_round_eligibility_criteria*nombre_electors)/100
                    // 6. Trouver tous les candidats qui ont obtenu plus de voix que le first_round_eligibility_criteria
                    // 🚀 S'il y en a un, on ne commence pas le deuxième tour pour ce poste
                    // 🚀 S'il y en a deux (ou trois, ou quatre, etc.), on crée le deuxième tour pour ce poste avec ces deux (trois ou quatre) candidats
                    // 🚀 S'il n'y en aucun, on récupère les "n" premiers candidats tels que défini dans le "candidates_to_be_retained_in_the_second_round"
                    // On crée le deuxième tour pour ce poste avec ces "n" candidats
                    // Si NON
                    // response.status(200).json({
                    //     message: 'Le round est terminé.',
                    //     round,
                    // })
                    .catch(() => {});
            }
        })
        .catch((error) => response.status(400).json({ error }));
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
