import { Hono } from 'hono';
import AuthMiddleware from '../middlewares/authentication';
import { createpost, privatepost, publicpost, getPostById, updatePost, deletePost } from '../db/postquery';
const postRoutes = new Hono();

postRoutes.get('/', async (c) => {
    const AuthHeader = c.req.header("Authorization")
    if (AuthHeader) {
        try {
            console.log(AuthHeader);
            await AuthMiddleware;
            const privateposts = await privatepost(c.username);
            c.status(200);
            return c.json({ privateposts });
        } catch (err) {
            console.error(err);
            c.status(400);
            c.json({ err: "something unexpected" });
        }
    } else {
        const publicposts = await publicpost();
        return c.json({ publicposts });
    }
    return c.text("hiii");
})

postRoutes.post('/', AuthMiddleware, async (c) => {
    try {
        const body = await c.req.json();

        const title = body?.title;
        const description = body?.description;
        const thumbnailUrl = body?.thumbnailUrl;
        const username = c.username;
        if (!(title && description)) {
            c.status(400);
            return c.json({ err: "please provide title and description" })
        }

        try {
            const res = await createpost(title, description, thumbnailUrl, username);
            return c.json(res);
        } catch (err) {
            console.error(err);
            c.status(400);
            return c.json({ err: "Internal Server Error" })
        }



    } catch (err) {
        c.status(400);
        console.log(err);
        return c.json({ err: "Internal Server Error" })
    }
})

postRoutes.get('/:id', async (c) => {
    const postId = Number(c.req.param("id"));
    try {
        const post = await getPostById(postId);
        if (!post) {
            c.status(404);
            return c.json({ error: 'Post not found' });
        }
        return c.json(post);
    } catch (error: any) {
        console.error('Error retrieving post:', error.message);
        c.status(500);
        c.json({ error: 'Internal Server Error' });
    }
});

postRoutes.put('/:id', AuthMiddleware, async (c) => {
    const postId = Number(c.req.param("id"));
    try {
        const post = await getPostById(postId);
        if (!post) {
            c.status(404);
            return c.json({ error: 'Post not found' });
        }
        const username = c.username;
        if (username == post.Author) {
            try {
                const body = await c.req.json();
                const title = body.title;
                const description = body.title;
                const thumbnailUrl = body.thumbnailUrl;
                const res = await updatePost(title, description, thumbnailUrl, postId);
                return c.json(res);
            } catch (err) {
                c.status(404);
                console.error(err);
                return c.json({ err: err });
            }
        } else {
            c.status(404);
            return c.json({ err: "Permission denied ! only admin can modify post" })
        }

    } catch (error: any) {
        console.error('Error retrieving post:', error.message);
        c.status(500);
        c.json({ error: 'Internal Server Error' });
    }

})

postRoutes.delete('/:id', AuthMiddleware, async (c) => {
    const postId = Number(c.req.param("id"));
    try {
        const post = await getPostById(postId);
        if (!post) {
            c.status(404);
            return c.json({ error: 'Post not found' });
        }
        const username = c.username;
        if (username == post.Author) {
            try {
                const res = await deletePost(postId);
                return c.json(res);
            } catch (err) {
                c.status(404);
                console.error(err);
                return c.json({ err: err });
            }
        } else {
            c.status(404);
            return c.json({ err: "Permission denied ! only admin can delete post" })
        }

    } catch (error: any) {
        console.error('Error retrieving post:', error.message);
        c.status(500);
        c.json({ error: 'Internal Server Error' });
    }
})
export default postRoutes;