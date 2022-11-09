# hasura-gql-client
[![npm version](https://badge.fury.io/js/hasura-gql-client.svg)](https://badge.fury.io/js/hasura-gql-client)

# WIP: Repository is under have development right now :-)

Typescript based [Hasura](https://hasura.io/) GQL client.

- 🚀 Blazing fast GraphQL
- ⚡️ Lightning Fast
- 🔑 Fully Typed APIs
- 🛠️ Rich Features
- 📦 Optimized Build
- 🥴 No Graphql string mess

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
import Client from 'hasura-gql-client';

interface TestUser {
	id: string;
	email: string;
	name: string;
}

interface Select {
	test_user: TestUser;
}

// Insert type
interface InsertTestUser {
	email: string;
	name: string;
}

interface Insert {
	test_user: InsertTestUser;
}

// Update type
interface UpdateTestUser {
	email?: string;
	name?: string;
}

interface Update {
	test_user: UpdateTestUser;
}

const client = new Client<Select, Insert, Update>({
	host: process.env.HOST ?? 'err',
	customHeaders: { 'x-hasura-admin-secret': process.env.X_HASURA_ADMIN_SECRET ?? 'err' },
	debug: true,
});

const start = async (): Promise<void> => {
	// select users
	const usersSelect = await client.select('test_user', ['id']);
	console.log(usersSelect[0]?.id);

	// insert
	const usersInsert = await client.insert('test_user', { email: 'foo@email.com', name: 'foo' }, ['id']);
	console.log(usersInsert[0].id);

	// update
	const usersUpdate = await client.update('test_user', { email: 'foo2@email.com' }, ['id']);
	console.log(usersUpdate[0].id);
};

```
See [example folder](https://github.com/JaLe29/hasura-gql-client/tree/master/example) for more details.
