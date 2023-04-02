import Post from '../models/postModel.js';

function create_post(request, response, next) {
    const { name } = request.body;

    const post = new Post({
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

export { create_post };
