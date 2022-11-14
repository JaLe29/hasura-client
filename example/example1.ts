/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import dotenv from 'dotenv';
import path from 'path';
import Client from '../src';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

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

	// aggregate
	const usersAggregate = await client.aggregate('test_user');
	console.log(usersAggregate.aggregate.count);

	// select by pk
	const userByPk = await client.selectByPk('test_user', ['id'], {
		pkName: 'id',
		pkValue: '3214',
	});

	console.log(userByPk);

	// select batch
	const r = await client.selectBatch([
		{
			entityName: 'test_user',
			fields: ['email'],
			options: { limit: 1 },
		},
		{
			entityName: 'test_book',
			fields: ['name'],
			options: { limit: 2 },
		},
	]);

	console.log(r);
};

start().catch(console.error);
