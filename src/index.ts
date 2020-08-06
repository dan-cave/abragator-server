import { ApolloServer } from 'apollo-server';

const server = new ApolloServer({ });

server.listen();

// HMR
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => {});
}
