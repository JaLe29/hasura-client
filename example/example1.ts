/* eslint-disable no-console */
import dotenv from 'dotenv';
import path from 'path';
import Client from '../src';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

interface TestUser {
	id: string;
	email: string;
}

interface Select {
	test_user: TestUser;
}

const client = new Client<Select>({
	host: process.env.HOST ?? 'err',
	customHeaders: { 'x-hasura-admin-secret': process.env.X_HASURA_ADMIN_SECRET ?? 'err' },
	debug: true,
});

const start = async (): Promise<void> => {
	const users = await client.select('test_user', ['id']);
	// console.log(users[0][0].id);
	console.log(users[0].id);
};

start().catch(console.error);
