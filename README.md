# hasura-gql-client
[![npm version](https://badge.fury.io/js/hasura-gql-client.svg)](https://badge.fury.io/js/hasura-gql-client)

# WIP: Repository is under have development right now :-)

Typescript based [Hasura](https://hasura.io/) GQL client.

-  Blazing fast GraphQL
-  ST types
-  No Graphql string mess

## Installation
```ts
yarn add hasura-gql-client
```
or
```ts
npm i hasura-gql-client
```

## Settings
```ts
interface TestUser {
	id: string;
	email: string;
}

interface Select {
	test_user: TestUser;
}

const client = new Client<Select>({
	host: "https://yourdomain.com/v1",
	customHeaders: { 'x-hasura-admin-secret': "****" },
	debug: true,
})

const users = await client.select('test_user', ['id']);

```
