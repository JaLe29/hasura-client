/* eslint-disable import/no-extraneous-dependencies */
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
export interface InsertTestUser {
	email: string;
}

export interface InsertTestBook {
	name: string;
}

interface Insert {
	test_user: InsertTestUser;
	test_book: InsertTestBook;
}

// Update type
export interface UpdateTestUser {
	email?: string;
}

export interface UpdateTestBook {
	name: string;
}

interface Update {
	test_user: UpdateTestUser;
	test_book: UpdateTestBook;
}

export const client = new Client<Select, Insert, Update>({
	host: process.env.HOST ?? 'err',
	customHeaders: { 'x-hasura-admin-secret': process.env.X_HASURA_ADMIN_SECRET ?? 'err' },
	debug: true,
});
