import Round from '../models/roundModel.js';
import Elector from '../models/electorModel.js';
import Election from '../models/electionModel.js';
import CandidateRound from '../models/candidateRoundModel.js';

import { send_email_to } from '../event/email.js';

function get_election_id_of_this(round) {
    const election_id = round.post_id.election_id;
    return election_id;
}

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

function create_round(request, response) {
    const { number, status, election_id } = request.body;

    const round = new Round({
        election_id: election_id,
        number: number,
        status: status,
    });

    round
        .save()
        .then((round) =>
            response.status(201).json({
                message: 'Un nouveau round a été créé avec succès.',
                round,
            })
        )
        .catch((error) => response.status(400).json({ error }));
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
                const post_id_of_this_round = round.post_id._id;

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
                                    let first_round_eligibility_criteria_voices =
                                        (electors_number *
                                            election.first_round_eligibility_criteria) /
                                        100;

                                    // 3.1. Trouver tous les candidats qui ont obtenu plus de voix que le first_round_eligibility_criteria_voices
                                    CandidateRound.find({
                                        voices: {
                                            $gt: first_round_eligibility_criteria_voices,
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

                                            // 🚀 S'il n'y en aucun, on récupère les "n" premiers candidats tels que défini dans le "candidates_to_be_retained_in_the_second_round"
                                            else if (
                                                candidates_rounds.length == 0
                                            ) {
                                            }
                                            // 🚀 S'il y en a deux (ou trois, ou quatre, etc.), on crée le deuxième tour pour ce poste avec ces deux (trois ou quatre) candidats
                                            else {
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
