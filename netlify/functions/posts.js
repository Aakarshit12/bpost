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

        if (event.httpMethod === 'GET') {
            const posts = await postsCollection
                .find({ isDeleted: false, status: 'published' })
                .sort({ createdAt: -1 })
                .toArray();

            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({ posts })
            };
        }

        if (event.httpMethod === 'POST') {
            const postData = JSON.parse(event.body);

            const newPost = {
                ...postData,
                createdAt: new Date(),
                updatedAt: new Date(),
                viewCount: 0,
                isDeleted: false,
                status: postData.status || 'draft'
            };

            const result = await postsCollection.insertOne(newPost);

            return {
                statusCode: 201,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({
                    message: 'Post created successfully',
                    post: {...newPost, _id: result.insertedId }
                })
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