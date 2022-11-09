/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import dotenv from 'dotenv';
import path from 'path';
import Client from '../src';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
// Select type
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

start().catch(console.error);
