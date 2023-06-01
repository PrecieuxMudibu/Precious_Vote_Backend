import Election from '../models/electionModel.js';
import Elector from '../models/electorModel.js';
import Candidate from '../models/candidateModel.js';
import Post from '../models/postModel.js';
import Round from '../models/roundModel.js';
import CandidateRound from '../models/candidateRoundModel.js';

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
function add_the_candidate_to_the_round(round, candidate) {
    const candidateRound = new CandidateRound({
        candidate_id: candidate._id,
        round_id: round._id,
        voice: 0,
    });

    candidateRound
        .save()
        .then((candidateRound) => {})
        .catch((error) => console.log({ candidate: error }));
}

function add_candidate(candidateInfo, post, election) {
    const candidate = new Candidate({
        name: candidateInfo.name,
        first_name: candidateInfo.first_name,
        picture: candidateInfo.picture,

        election_id: election._id,
        post_id: post._id,
    });

    candidate
        .save()
        .then((candidate) => {})
        .catch((error) => console.log({ candidate: error }));

    return candidate;
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

function add_elector(electorInfo, election) {
    const elector = new Elector({
        name: electorInfo.name,
        first_name: electorInfo.first_name,
        email: electorInfo.email,
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
}

async function create_election(request, response, next) {
    const {
        created_by,
        name,
        description,
        picture,
        status,
        first_round_eligibility_criteria,
        candidates_for_the_second_round,
        electors,
        candidates,
        tariff,
        two_rounds,
    } = request.body;

    if (
        !tariff ||
        (tariff != 'Free' && tariff != 'Premium' && tariff != 'VIP')
    ) {
        return response.status(404).json({
            message: "Vous n'avez pas indiqué le tarif de l'élection",
        });
    } else {
        const election = new Election({
            created_by: user_id,
            name: name,
            description: description,
            first_round_eligibility_criteria: first_round_eligibility_criteria,
            candidates_for_the_second_round: candidates_for_the_second_round,
            status: 'Not yet',
            tariff: tariff,
            two_rounds: two_rounds,
        });

        election
            .save()
            .then((election) => {
                // ADD ELECTORS
                for (let i = 0; i < electors.length; i++) {
                    let current_elector = electors[i];
                    add_elector(current_elector, election);
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
                            let round_1 = create_round(1, post);
                            console.log('round_1 >>> ', round_1);

                            // ADD CANDIDATES TO THEIR POST
                            for (
                                let j = 0;
                                j < current_element.people.length;
                                j++
                            ) {
                                let current_candidate =
                                    current_element.people[j];
                                const candidate = add_candidate(
                                    current_candidate,
                                    post,
                                    election
                                );
                                console.log('candidate >>> ', candidate);

                                // ADD CANDIDATES TO THE LIST OF PARTICIPANT FOR THE ROUND 1
                                add_the_candidate_to_the_round(
                                    round_1,
                                    candidate
                                );
                            }
                        })
                        .catch((error) => console.log({ post: error }));
                }
            })
            .catch((error) => console.log({ election: error }));

        return response.status(201).json({
            message: 'Votre élection a été créée avec succès.',
            election,
        });
    }
}

function get_an_election(request, response) {
    const { election_id } = request.params;

    const query = { _id:  election_id };

    Election.findOne(query)
        .then((election) => response.status(200).json({ election }))
        .catch((error) => response.status(500).json({ error }));
}

function get_elections_of_the_current_user(request, response) {
    const { user_id } = request.params;

    const query = { user_id: user_id };

    Election.find(query)
        .then((elections) => response.status(200).json({ elections }))
        .catch((error) => response.status(500).json({ error }));
}
export { create_election, get_elections_of_the_current_user, get_an_election };
