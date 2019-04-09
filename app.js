const express = require('express');
const bodyParser = require('body-parser');
const graphQLHTTP = require('express-graphql'); //imports a function used where express expects a middleware function which takes incoming requests and funnel them through graphQL query parsers and then forward to relevant resolver
const { buildSchema } = require('graphql');
const app = express();

app.use(bodyParser.json());

app.use(
  '/graphql',
  //schema has two properties: query & mutation
  //graphql is a typed language, define the query and mutation (can call w/e) and declare the type and link it via the schema (bundles the query and mutations)
  graphQLHTTP({
    schema: buildSchema(`
    type RootQuery {
      events: [String!]!
    }

    type RootMutation {
      createEvent(name: String): String
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
    `),
    //resolvers - logic aka controllers, need to follow the same name as query and mutation objects
    rootValue: {
      events: () => {
        return ['Romantic Cooking', 'Sailing', 'All-night Coding'];
      },
      createEvent: args => {
        const eventName = args.name;
        return eventName;
      }
    },
    graphiql: true // provides us graphql interface
  })
);

app.listen(3000);
