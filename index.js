const { createServer } = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { SubscriptionManager } = require('graphql-subscriptions');
const { SubscriptionServer } = require('subscriptions-transport-ws');

const pubsub = require('./pubsub');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// create express app and http server
const app = express();
const server = createServer(app);

// create GraphQL schema and subscription manager
const schema = makeExecutableSchema({ typeDefs, resolvers });
const subscriptionManager = new SubscriptionManager({ schema, pubsub });

// set /graphql in development and / in production
if (process.env.NODE_ENV !== 'production') {
  app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
} else {
  app.use('/', bodyParser.json(), graphqlExpress({ schema }));
}

// set GraphiQL IDE in development
if (process.env.NODE_ENV !== 'production') {
  app.use('/ide', graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://${HOST}:${PORT}/subscriptions`,
  }));
}

server.listen(PORT, HOST, error => {
  new SubscriptionServer({ subscriptionManager }, { server, path: '/subscriptions' });
  console.log('> Server running on http://%s:%d', HOST, PORT)
});
