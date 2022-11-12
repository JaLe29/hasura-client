/* eslint-disable no-console */
import type { InsertTestUser } from './client';
import { client } from './client';

const rndString = (): string => (Math.random() + 1).toString(36).substring(7);
const expect = (value: string | number, expectedValue: string | number): void => {
	if (value !== expectedValue) {
		console.error({ value, expectedValue });
		throw new Error('Test error...');
	}
};

const start = async (): Promise<void> => {
	const testUser: InsertTestUser = {
		email: `email-${rndString()}`,
	};

	const [newUser] = await client.insert('test_user', testUser, ['id', 'email']);
	expect(newUser.email, testUser.email);

	const newUserEmail = `email-${rndString()}`;
	const [updatedUser] = await client.update('test_user', { email: newUserEmail }, ['id', 'email'], {
		where: { id: { _eq: newUser.id } },
	});

	expect(updatedUser.email, newUserEmail);
	expect(newUser.id, updatedUser.id);

	const userCount = await client.aggregate('test_user', { where: { id: { _eq: newUser.id } } });
	expect(userCount.aggregate.count, 1);

	await client.delete('test_user', ['id'], { id: { _eq: newUser.id } });

	const userCountAfterDelete = await client.aggregate('test_user', { where: { id: { _eq: newUser.id } } });
	expect(userCountAfterDelete.aggregate.count, 0);

	console.log('TEST OK');
};

start().catch(console.error);
