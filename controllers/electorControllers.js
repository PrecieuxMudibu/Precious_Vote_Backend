import Elector from '../models/electorModel.js';

function update_elector(request, response, next) {
    const { email } = request.body;
    const { elector_id } = request.params;

    const filter = { _id: elector_id };
    const update = { email: email };

    Elector.findOneAndUpdate(filter, update)
        .then((elector) => {
            response.status(200).json({
                message: "L'électeur a été mis à jour avec succès.",
                elector,
            });
        })
        .catch((error) => response.status(400).json({ error }));
}

function get_electors(request, response) {
    const { election_id } = request.params;

    const query = { election_id: election_id };

    Elector.find(query)
        .then((electors) => response.status(200).json({ electors }))
        .catch((error) => response.status(500).json({ error }));
}

export { update_elector, get_electors };
