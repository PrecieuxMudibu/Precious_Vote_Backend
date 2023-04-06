import Election from '../models/electionModel.js';
import Elector from '../models/electorModel.js';
import Candidate from '../models/candidateModel.js';
import Post from '../models/postModel.js';
import Round from '../models/roundModel.js';

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
        status,
        first_round_eligibility_criteria,
        electors,
        candidates,
        two_rounds,
    } = request.body;

    const election = new Election({
        user_id: user_id,
        name: name,
        description: description,
        first_round_eligibility_criteria: first_round_eligibility_criteria,
        status: 'Not yet',
        two_rounds: two_rounds,
    });

    election
        .save()
        .then((election) => {})
        .catch((error) => console.log({ election: error }));

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
            .catch((error) => console.log({ elector: error }));

        // TODOS : SEND EMAIL WHICH CONTAIN THE TOKEN FOR VOTE TO THE ELECTORS
    }

    // ADD POST
    for (let i = 0; i < candidates.length; i++) {
        let current_element = candidates[i];

        let current_post = current_element.post;
        const post = new Post({
            election_id: election._id,
            name: current_post,
        });
        post.save()
            .then((post) => {
                console.log(
                    'NEW POST post_id>>>',
                    post.name + ' >>>' + post.id
                );
            })
            .catch((error) => console.log({ post: error }));

        // ADD A ROUND FOR THIS POST
        if (two_rounds == true) {
            const round_1 = new Round({
                post_id: post._id,
                number: 1,
                status: 'Not started',
            });
            round_1
                .save()
                .then((round_1) => {})
                .catch((error) => console.log({ round_1: error }));

            const round_2 = new Round({
                post_id: post._id,
                number: 2,
                status: 'Not started',
            });
            round_2
                .save()
                .then((round_2) => {})
                .catch((error) => console.log({ round_2: error }));
        } else {
            const round_1 = new Round({
                post_id: post._id,
                number: 1,
                status: 'Not started',
            });
            round_1
                .save()
                .then((round_1) => {})
                .catch((error) => console.log({ round_1: error }));
        }

        // ADD CANDIDATES TO THEIR POST
        for (let j = 0; j < current_element.people.length; j++) {
            let current_candidate = current_element.people[j];

            const candidate = new Candidate({
                name: current_candidate.name,
                first_name: current_candidate.first_name,
                picture: current_candidate.picture,

                election_id: election._id,
                post_id: post._id,
            });
            candidate
                .save()
                .then((candidate) => {})
                .catch((error) => console.log({ candidate: error }));
        }
    }

    return response.status(201).json({
        message: 'Votre élection a été créée avec succès.',
        election,
    });
}

export { create_election };
