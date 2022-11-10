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

interface TestBook {
	id: string;
	name: string;
}

interface TestUser {
	id: string;
	email: string;
	books: TestBook[];
	book: TestBook;
}

interface Select {
	test_user: TestUser;
	test_book: TestBook;
}

// Insert type
interface InsertTestUser {
	email: string;
}

interface InsertTestBook {
	name: string;
}

interface Insert {
	test_user: InsertTestUser;
	test_book: InsertTestBook;
}

// Update type
interface UpdateTestUser {
	email?: string;
}

interface UpdateTestBook {
	name: string;
}

interface Update {
	test_user: UpdateTestUser;
	test_book: UpdateTestBook;
}

const client = new Client<Select, Insert, Update>({
	host: process.env.HOST ?? 'err',
	customHeaders: { 'x-hasura-admin-secret': process.env.X_HASURA_ADMIN_SECRET ?? 'err' },
	debug: true,
});

const start = async (): Promise<void> => {
	// select
	const usersSelect2 = await client.select('test_user', ['id', 'book.name', 'books.id']);
	console.log(usersSelect2[0]?.id);
	console.log(usersSelect2[0]?.books[0].id);
	console.log(usersSelect2[0]?.book.name);

	// insert
	const usersInsert = await client.insert('test_user', { email: 'foo@email.com', name: 'foo' }, ['id']);
	console.log(usersInsert[0].id);

	// update
	const usersUpdate = await client.update('test_user', { email: 'foo2@email.com' }, ['id']);
	console.log(usersUpdate[0].id);
};

start().catch(console.error);

```
See [example folder](https://github.com/JaLe29/hasura-gql-client/tree/master/example) for more details.
