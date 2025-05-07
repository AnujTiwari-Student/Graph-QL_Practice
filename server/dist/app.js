"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express4_1 = require("@apollo/server/express4");
const axios_1 = __importDefault(require("axios"));
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const server = new server_1.ApolloServer({
            typeDefs: `
            type Todo {
                id: ID!
                title: String!
                completed: Boolean!
            }

            type Query {
                getTodos: [Todo]
            }
        `,
            resolvers: {
                Query: {
                    getTodos: () => axios_1.default.get('https://jsonplaceholder.typicode.com/todos')
                }
            },
        });
        app.use((0, cookie_parser_1.default)());
        app.use((0, cors_1.default)());
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        yield server.start();
        app.use('/graphql', (0, express4_1.expressMiddleware)(server));
        app.listen(4000, () => {
            console.log('Server is running on http://localhost:4000/graphql');
        });
    });
}
startServer().catch((err) => {
    console.error('Error starting server:', err);
    process.exit(1);
});
