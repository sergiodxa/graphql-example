const { resolve } = require('path');
const cuid = require('cuid');
const db = require('diskdb').connect(resolve('./data'), ['messages']);
const pubsub = require('./pubsub');

class Database {
  getSingle(id) { return db.messages.findOne({ id }) }

  getAll() { return db.messages.find() }

  sendMessage({ content, author }) {
    const id = cuid();
    const message = { id, author, content, stars: 0 };
    db.messages.save(message);
    pubsub.publish('messageSent', message);
    return message;
  }

  voteMessage(id) {
    db.messages.update({ id }, { stars: this.getSingle(id).stars + 1 });
    pubsub.publish('messageVoted', { id });
    return { id };
  }

  unvoteMessage(id) {
    db.messages.update({ id }, { stars: this.getSingle(id).stars - 1 });
    pubsub.publish('messageUnvoted', { id });
    return { id };
  }
}

module.exports = new Database();
