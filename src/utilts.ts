// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import gqlPrettier from 'graphql-prettier';

export const prettyGql = (gql: string): string => gqlPrettier(gql);
