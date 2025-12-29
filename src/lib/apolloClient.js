import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

// Get GraphQL API URL from environment variables
const GRAPHQL_API_URL = import.meta.env.VITE_GRAPHQL_API_URL;

if (!GRAPHQL_API_URL) {
  console.error('VITE_GRAPHQL_API_URL is not defined in environment variables');
}

// HTTP Link - connects to GraphQL API
const httpLink = createHttpLink({
  uri: GRAPHQL_API_URL,
  credentials: 'include', // Include cookies for authentication
});

// Auth Link - adds authentication token to requests
const authLink = setContext((_, { headers }) => {
  // Get auth token from localStorage
  const token = localStorage.getItem('authToken');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    }
  };
});

// Error Link - handles GraphQL and network errors
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`
      );

      // Handle authentication errors
      if (extensions?.code === 'UNAUTHENTICATED') {
        // Clear token and redirect to login
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }

      // Handle authorization errors
      if (extensions?.code === 'FORBIDDEN') {
        console.error('Access denied. You do not have permission to perform this action.');
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);

    // Handle offline scenarios
    if (!navigator.onLine) {
      console.error('You appear to be offline. Please check your internet connection.');
    }
  }
});

// Cache configuration with type policies
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Example: Configure pagination for a buildings query
        buildings: {
          keyArgs: ['filter', 'sort'],
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
        // Example: Configure pagination for rooms query
        rooms: {
          keyArgs: ['buildingId', 'filter'],
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
      },
    },
    // Add type policies for your entities
    Building: {
      keyFields: ['id'],
    },
    Room: {
      keyFields: ['id'],
    },
    Tenant: {
      keyFields: ['id'],
    },
    Bill: {
      keyFields: ['id'],
    },
  },
});

// Create Apollo Client instance
const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network', // Always fetch from network but use cache while loading
      errorPolicy: 'all', // Return both data and errors
    },
    query: {
      fetchPolicy: 'network-only', // Always fetch from network for queries
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all', // Return both data and errors for mutations
    },
  },
  // Enable developer tools in development
  connectToDevTools: import.meta.env.DEV,
});

export default apolloClient;
