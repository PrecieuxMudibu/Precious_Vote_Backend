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

async function create_election(request, response, next) {
    const {
        created_by,
        name,
        description,
        picture,
        first_round_eligibility_criteria,
        candidates_for_the_second_round,
        electors,
        posts,
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
            created_by,
            name,
            description,
            first_round_eligibility_criteria,
            candidates_for_the_second_round,
            tariff,
            two_rounds,
        });

        const election_created = await election.save();
        let electors_created_to_add_in_the_electors_properties_of_the_election =
            [];

        // ADD ELECTORS------------------------------------------------------------------------
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
                election: election_created._id,
            });

            const elector_created = await elector.save();
            electors_created_to_add_in_the_electors_properties_of_the_election.push(
                elector_created._id
            );
        }
        // ADD ELECTORS------------------------------------------------------------------------

        // ADD POST------------------------------------------------------------------------------
        let posts_created_to_add_in_the_electors_properties_of_the_election =
            [];
        for (let i = 0; i < posts.length; i++) {
            const post = new Post({
                election: election_created._id,
                name: posts[i].name,
            });
            const post_created = await post.save();
            posts_created_to_add_in_the_electors_properties_of_the_election.push(
                post_created._id
            );

            // // ---CREATE ROUND------------------
            const round_1 = new Round({
                post: post_created._id,
                number: 1,
                status: 'Not started',
            });
            const round_1_created = await round_1.save();
            // // ---CREATE ROUND------------------

            // // ---CREATE CANDIDATE------------------
            let candidates_created_to_add_in_the_electors_properties_of_the_election =
                [];
            for (let j = 0; j < posts[i].candidates.length; j++) {
                let current_candidate = posts[i].candidates[j];

                const candidate = new Candidate({
                    name: current_candidate.name,
                    first_name: current_candidate.first_name,
                    picture: current_candidate.picture,
                    election: election_created._id,
                    post: post_created._id,
                });
                const candidate_created = await candidate.save();
                // PAS DE PROBLEME AU DESSUS

                candidates_created_to_add_in_the_electors_properties_of_the_election.push(
                    {
                        _id: candidate_created._doc._id,
                        voices: 0,
                        candidate: candidate_created._doc._id,
                    }
                );

                console.log(
                    'UPDATE',
                    candidates_created_to_add_in_the_electors_properties_of_the_election
                );
                const round_to_add_the_candidate = await Round.findOne({
                    _id: round_1_created._id,
                });
                if (round_to_add_the_candidate) {
                    await Round.findOneAndUpdate(
                        { _id: round_to_add_the_candidate._id },
                        {
                            candidates:
                                candidates_created_to_add_in_the_electors_properties_of_the_election,
                        },
                        {
                            new: true,
                        }
                    );
                }
            }

            //  ADD THE CANDIDATES ID TO THE CANDIDATES PROPERTIES OF A ROUND
            // await Round.findOneAndUpdate(
            //     { _id: round_1_created._id },
            //     {
            //         candidates:
            //             candidates_created_to_add_in_the_electors_properties_of_the_election,
            //     },
            //     {
            //         new: true,
            //     }
            // );
            //  ADD THE CANDIDATES ID TO THE CANDIDATES PROPERTIES OF A ROUND

            //  ADD THE CANDIDATES ID TO THE CANDIDATES PROPERTIES OF A POST
            await Post.findOneAndUpdate(
                { _id: post_created._id },
                {
                    candidates:
                        candidates_created_to_add_in_the_electors_properties_of_the_election,
                    rounds: [round_1_created._id],
                },
                {
                    new: true,
                }
            );
            //  ADD THE CANDIDATES ID TO THE CANDIDATES PROPERTIES OF A POST
        }

        const election_final = await Election.findOneAndUpdate(
            { _id: election_created._id },
            {
                electors:
                    electors_created_to_add_in_the_electors_properties_of_the_election,
                posts: posts_created_to_add_in_the_electors_properties_of_the_election,
            },
            {
                new: true,
            }
        )
            .populate({
                path: 'posts',
                populate: [
                    { path: 'candidates' },
                    {
                        path: 'rounds',
                        populate: { path: 'candidates.candidate' },
                    },
                ],
            })
            .populate('electors');

        return response.status(201).json({
            message: 'Votre élection a été créée avec succès.',
            election: election_final,
        });
    }
}

function get_an_election(request, response) {
    const { election_id } = request.params;

    const query = { _id: election_id };

    Election.findOne(query)
        .populate({
            path: 'posts',
            populate: [{ path: 'candidates' }, { path: 'rounds' }],
        })
        .populate('electors')
        .then((election) => response.status(200).json({ election }))
        .catch((error) => response.status(500).json({ error }));
}

function get_elections_of_the_current_user(request, response) {
    const { user_id } = request.params;

    const query = { created_by: user_id };

    Election.find(query)
        .populate({
            path: 'posts',
            populate: [{ path: 'candidates' }, { path: 'rounds' }],
        })
        .populate('electors')
        .then((elections) => response.status(200).json({ elections }))
        .catch((error) => response.status(500).json({ error }));
}
export { create_election, get_elections_of_the_current_user, get_an_election };
