import Election from '../models/electionModel.js';
import Elector from '../models/electorModel.js';
import Candidate from '../models/candidateModel.js';

function generate_random_string(o) {
    var a = 10,
        b = 'abcdefghijklmnopqrstuvwxyz',
        c = '',
        d = 0,
        e = '' + b;
    if (o) {
        if (o.startsWithLowerCase) {
            c = b[Math.floor(Math.random() * b.length)];
            d = 1;
        }
        if (o.length) {
            a = o.length;
        }
        if (o.includeUpperCase) {
            e += b.toUpperCase();
        }
        if (o.includeNumbers) {
            e += '1234567890';
        }
    }
    for (; d < a; d++) {
        c += e[Math.floor(Math.random() * e.length)];
    }
    return c;
}

function create_election(request, response, next) {
    const {
        user_id,
        name,
        description,
        begin_date,
        end_date,
        status,
        first_round_eligibility_criteria,
        electors,
        candidates,
    } = request.body;

    const election = new Election({
        user_id: user_id,
        name: name,
        description: description,
        begin_date: begin_date,
        end_date: end_date,
        first_round_eligibility_criteria: first_round_eligibility_criteria,
        status: 'Not yet',
    });

    election
        .save()
        .then((election) => {})
        .catch((error) => response.status(400).json({ error: 'rrr' }));

    // ADD ELECTORS
    for (let i = 0; i < electors.length; i++) {
        let current_elector = electors[i];

        const elector = new Elector({
            name: current_elector.name,
            first_name: current_elector.first_name,
            email: current_elector.email,
            token_for_vote: generate_random_string({
                includeUpperCase: true,
                includeNumbers: true,
                length: 50,
                startsWithLowerCase: true,
            }),
            election_id: election._id,
        });

        elector
            .save()
            .then((elector) => {})
            .catch((error) => response.status(404).json({ error }));
    }

    // ADD CANDIDATES
    for (let i = 0; i < candidates.length; i++) {
        let current_element = candidates[i];
        let current_post = current_element.post_id;

        for (let j = 0; j < current_element.people.length; j++) {
            let current_candidate = current_element.people[j];

            const candidate = new Candidate({
                name: current_candidate.name,
                first_name: current_candidate.first_name,
                picture: current_candidate.picture,

                election_id: election._id,
                post_id: current_post,
            });

            candidate
                .save()
                .then((candidate) => {})
                .catch((error) => response.status(404).json({ error }));
        }
    }

    return response.status(201).json({
        message: 'Votre élection a été créée avec succès.',
        election,
    });
}

export { create_election };
