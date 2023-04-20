import Post from '../models/postModel.js';

function create_post(request, response, next) {
    const { election_id, name } = request.body;

    const post = new Post({
        election_id: election_id,
        name: name,
    });

    post.save()
        .then((post) =>
            response.status(201).json({
                message: 'Un nouveau poste a été ajouté avec succès.',
                post,
            })
        )
        .catch((error) => response.status(400).json({ error }));
}

function get_posts_for_an_election(request, response) {
    const { election_id } = request.params;

    const query = { election_id: election_id };

    Post.find(query)
        .then((posts) => response.status(200).json({ posts }))
        .catch((error) => response.status(500).json({ error }));
}

export { create_post, get_posts_for_an_election };
