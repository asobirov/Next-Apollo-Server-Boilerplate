import Cors from "micro-cors";
import { gql, ApolloServer } from "apollo-server-micro";

export const config = {
  api: {
    bodyParser: false,
  },
};

type Book = {
  title: String;
  author: String;
};
const books: Book[] = [
  {
    title: "The Awakening",
    author: "Kate Chopin Tree",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    books: () => books,
  },
};

const cors = Cors();

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,

  context: ({ req }) => {},
  introspection: true,
  //   playground: true,
});

const serverStart = apolloServer.start();

export default cors(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  await serverStart;
  await apolloServer.createHandler({ path: "/api/graphql" })(req, res);
});
