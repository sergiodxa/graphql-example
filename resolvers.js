const db = require('./db');

const resolvers = {
  Query: {
    messages() {
      return db.getAll();
    },
    message(_, { id }) {
      return db.getSingle(id);
    },
  },
  Mutation: {
    sendMessage(_, { content, author }) {
      return db.sendMessage({ content, author });
    },
    voteMessage(_, { id }) {
      db.voteMessage(id);
      return db.getSingle(id);
    },
    unvoteMessage(_, { id }) {
      db.unvoteMessage(id);
      return db.getSingle(id);
    },
  },
  Subscription: {
    messageSent(message) { return message },
    messageVoted({ id }) { return db.getSingle(id) },
    messageUnvoted({ id }) { return db.getSingle(id) },
  },
};

module.exports = resolvers;
