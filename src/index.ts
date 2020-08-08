import { ApolloServer } from 'apollo-server';
import RedditAPI from './datasources/reddit';
import RedditResolver from './resolvers/reddit';
import typeDefs from './datasources/schema';

const dataSources = () => ({
  redditAPI: new RedditAPI(),
});

const context = () => {};

const server = new ApolloServer({
  context,
  typeDefs,
  dataSources,
  resolvers: RedditResolver,
});

server.listen();

// HMR
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => {});
}
