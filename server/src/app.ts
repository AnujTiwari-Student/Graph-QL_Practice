import express from 'express';
import { ApolloServer } from '@apollo/server';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {expressMiddleware} from '@apollo/server/express4';
import axios from 'axios';

async function startServer(){
    const app = express();
    const server = new ApolloServer({
        typeDefs: `

            type User {
                id: ID!
                name: String!
                email: String!
                phone: String
            }

            type Todo {
                id: ID!
                title: String!
                completed: Boolean!
                userId: ID!
                user: User
            }

            type Query {
                getTodos: [Todo]
                getAllUsers: [User]
                getUser(id: ID!): User
            }
        `,
        resolvers: {
            Todo: {
                user: async (todo) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)).data,
            },
            Query: {
                getTodos: async () => (await axios.get('https://jsonplaceholder.typicode.com/todos')).data,
                getAllUsers: async () => (await axios.get('https://jsonplaceholder.typicode.com/users')).data,
                getUser: async (_: any, { id }: { id: string }) => {
                    const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
                    return response.data;
                },
            }
        },
    })

    app.use(cookieParser());
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    await server.start();

    app.use('/graphql', expressMiddleware(server));

    app.listen(4000, () => {
        console.log('Server is running on http://localhost:4000/graphql');
    });
}

startServer().catch((err) => {
    console.error('Error starting server:', err);
    process.exit(1);
});