const express = require('express');
const bodyParser = require('body-parser');
const graphQLHTTP = require('express-graphql'); //imports a function used where express expects a middleware function which takes incoming requests and funnel them through graphQL query parsers and then forward to relevant resolver
const { buildSchema } = require('graphql');
const app = express();

const events = [];

app.use(bodyParser.json());

app.use(
  '/graphql',
  //schema has two properties: query & mutation
  //graphql is a typed language, define the query and mutation (can call w/e) and declare the type and link it via the schema (bundles the query and mutations)
  //type Event e.g. we have an Event with property (id) and type of data (ID!) - GRAPHQL syntax, exclation means it must never be null, i.e. ID should always be given
  //input is input type used as a list of individual argumentstbone
  graphQLHTTP({
    schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input EventInput { 
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
    `),
    //resolvers - logic aka controllers, need to follow the same name as query and mutation objects
    rootValue: {
      events: () => {
        return events;
      },
      createEvent: args => {
        const event = {
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: args.eventInput.date
        };
        events.push(event);
        return event;
      }
    },
    graphiql: true // provides us graphql interface
  })
);

app.listen(3000);
