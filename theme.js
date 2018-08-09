import { future as theme } from 'mdx-deck/themes';
import syntaxStyle from 'react-syntax-highlighter/styles/prism/atom-dark'
import prismGraphql from 'react-syntax-highlighter/languages/prism/graphql'
import Provider from './ApolloProvider';

export default {
  ...theme,
  prism: {
    style: syntaxStyle,
    languages: {
      graphql: prismGraphql
    }
  },
  Provider
}
