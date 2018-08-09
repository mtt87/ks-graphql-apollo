import React from 'react';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { InMemoryCache, defaultDataIdFromObject, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import introspectionQueryResultData from './fragmentTypes.json';
import { ApolloProvider } from 'react-apollo';

const httpLink = createHttpLink({
  uri: 'https://www.tes-stage.com/api/graphql',
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    'Referer' : 'https://www.tes-stage.com/',
    'Authorization': 'Bearer __YOUR_TOKEN_HERE'
  },
}));

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});

export const apolloClient = new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache({
    fragmentMatcher,
    dataIdFromObject: object => {
      switch (object.__typename) {
        case 'PostConversation': return object.postId;
        case 'Group': return object.groupId;
        default: return defaultDataIdFromObject(object); // fall back to default handling
      }
    }
  })
});

const Provider = (props) => (
  <ApolloProvider client={apolloClient}>
    {props.children}
  </ApolloProvider>
);

export default Provider;
