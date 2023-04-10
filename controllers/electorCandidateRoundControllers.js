import ElectorCandidateRound from '../models/electorCandidateRoundModel.js';
import CandidateRound from '../models/candidateRoundModel.js';

function get_candidates_of_this_round(candidatesrounds) {
    let candidates_of_this_rounds = [];
    for (let i = 0; i < candidatesrounds.length; i++) {
        candidates_of_this_rounds.push(candidatesrounds[i].candidate_id);
    }

    return candidates_of_this_rounds;
}

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

// VOTES TABLE
function get_ElectorCandidateRound_of_the_candidates(request, response) {
    const { election_id, post_id, round_id } = request.body;
    const query = { round_id: round_id };

    // Récupérer tous les candidats à un round
    CandidateRound.find(query)
        .populate({
            path: 'candidate_id',
            select: ['name', 'first_name', 'picture'],
        })
        .then((candidatesrounds) => {
            let candidates_of_this_rounds =
                get_candidates_of_this_round(candidatesrounds);

            // let candidates_and_his_number_of_voices = [];

            // // GET VOICES
            // for (let i = 0; i < candidates_of_this_rounds.length; i++) {
            //     let current_candidate = candidates_of_this_rounds[i];

            //     const query = { candidate_id: current_candidate._id };
            //     ElectorCandidateRound.find(query)
            //         .then((electorCandidateRound) => {
            //             candidates_and_his_number_of_voices.push({
            //                 ...current_candidate,
            //                 voices: electorCandidateRound.length,
            //             });
            //         })
            //         .catch((error) => console.log('error>>>', error));
            // }

            let candidates_and_his_number_of_voices = [];

            // for (let i = 0; i < candidates_of_this_rounds.length; i++) {
            //     let current_candidate = candidates_of_this_rounds[i];
            //     const query = { candidate_id: current_candidate._id };
            //     ElectorCandidateRound.find(query)
            //         .then((electorCandidateRound) => {
            //             candidates_and_his_number_of_voices.push({
            //                 ...current_candidate,
            //                 voices: electorCandidateRound.length,
            //             });
            //         })
            //         .catch((error) => console.log('error>>>', error));
            // }

            // let results = [];
            // candidates_of_this_rounds.forEach((candidate, index) => {
            //     ElectorCandidateRound.find({ candidate_id: candidate._id })
            //         .then((data) => (results[index] = data))
            //         // .then((data) => console.log('data>>', index))
            //         .catch((err) => console.log(err));
            // });
            // console.log('results>>>', results);

            let results = [];
            candidates_of_this_rounds.forEach((candidate) => {
                ElectorCandidateRound.find(
                    { candidate_id: candidate._id },
                    async (err, data) => {
                        if (err) {
                            console.log(err);
                        } else {
                            results.push(await data);
                        }
                    }
                );
            });
            console.log(results);

            // console.log(
            //     'candidates_and_his_number_of_voices>>>',
            //     candidates_and_his_number_of_voices
            // );
        })
        .catch((error) => response.status(500).json({ error }));

    // Récupérer le nombre d'électeur pour cette élection

    // BOUCLE SUR LES CANDIDATS
    // Récupérer le nombre de voix d'un candidat
    // Calculer le pourcentage de voix de ce candidat par rapport au nombre des électeurs
    // Ajouter le candidat, ses voix et son pourcentage de voix dans un tableau
    // RENVOYER CE TABLEAU
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
    get_ElectorCandidateRound_of_the_candidates,
    delete_all_ElectorCandidateRound,
};
