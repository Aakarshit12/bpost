const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

exports.handler = async(event, context) => {
    if (!MONGODB_URI) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'MongoDB URI not configured' })
        };
    }

    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db();
        const postsCollection = db.collection('posts');

        // Extract slug from the path
        const slug = event.path.split('/').pop();

        if (event.httpMethod === 'GET') {
            const post = await postsCollection.findOneAndUpdate({
                slug,
                isDeleted: false,
                status: 'published'
            }, { $inc: { viewCount: 1 } }, { returnDocument: 'after' });

            if (!post.value) {
                return {
                    statusCode: 404,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: JSON.stringify({ error: 'Post not found' })
                };
            }

            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({ post: post.value })
            };
        }

        if (event.httpMethod === 'PUT') {
            const updateData = JSON.parse(event.body);

            const updatedPost = await postsCollection.findOneAndUpdate({ slug, isDeleted: false }, {
                $set: {
                    ...updateData,
                    updatedAt: new Date()
                }
            }, { returnDocument: 'after' });

            if (!updatedPost.value) {
                return {
                    statusCode: 404,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: JSON.stringify({ error: 'Post not found' })
                };
            }

            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({
                    message: 'Post updated successfully',
                    post: updatedPost.value
                })
            };
        }

        if (event.httpMethod === 'DELETE') {
            const deletedPost = await postsCollection.findOneAndUpdate({ slug, isDeleted: false }, { $set: { isDeleted: true } }, { returnDocument: 'after' });

            if (!deletedPost.value) {
                return {
                    statusCode: 404,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: JSON.stringify({ error: 'Post not found or already deleted' })
                };
            }

            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({ message: 'Post deleted successfully' })
            };
        }

        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };

    } catch (error) {
        console.error('Database error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    } finally {
        await client.close();
    }
};