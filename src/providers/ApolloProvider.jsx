import React from 'react';
import { ApolloProvider as ApolloClientProvider } from '@apollo/client/react';
import apolloClient from '../lib/apolloClient';

/**
 * Apollo Provider Wrapper
 *
 * Wraps the application with Apollo Client provider to enable GraphQL queries
 * and mutations throughout the component tree.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
const ApolloProvider = ({ children }) => {
  return (
    <ApolloClientProvider client={apolloClient}>
      {children}
    </ApolloClientProvider>
  );
};

export default ApolloProvider;
