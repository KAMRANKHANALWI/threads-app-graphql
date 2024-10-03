import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  // CREATE GRAPHQL SERVER
  const gqlServer = new ApolloServer({
    // Schema
    typeDefs: `
      type Query {
        hello: String
        say(name: String): String
      }
    `,
    // query or actual functions
    resolvers: {
      Query: {
        hello: () => "Hey There",
        say: (_, { name } : {name : String}) => `Hey ${name}, How are you?`
      }
    },
  });

  // Start the gql server
  await gqlServer.start();

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  app.use("/graphql", expressMiddleware(gqlServer));

  app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
}

init();
