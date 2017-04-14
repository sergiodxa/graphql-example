module.exports = `
# A single chat message
type Message {
  # Message unique ID
  id: String!
  # Message content
  content: String!
  # Message stars
  stars: Int!
  # Author username
  author: String!
}

type Query {
  # Get a single message
  message(id: String!): Message
  # Get the whole message list
  messages: [Message]
}

type Mutation {
  # Create a new message
  sendMessage(
    content: String!
    author: String!
  ): Message
  # Add a message vote
  voteMessage(
    id: String!
  ): Message
  # Remove a message vote
  unvoteMessage(
    id: String!
  ): Message
}

type Subscription {
  # Subscribe to new messages
  messageSent: Message
  # Subscribe to messages voted
  messageVoted: Message
  # Subscribe to messages unvoted
  messageUnvoted: Message
}

type Schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}
`;
