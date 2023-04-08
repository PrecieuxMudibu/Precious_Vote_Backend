import ElectorCandidateRound from '../models/electorCandidateRoundModel.js';

function delete_all_ElectorCandidateRound(request, response) {
    ElectorCandidateRound.deleteMany()
        .then(() =>
            response({
                message: 'TOus les electorCandidateRound ont été supprimés',
            })
        )
        .catch((error) => response.json(error));
}

export { delete_all_ElectorCandidateRound };
