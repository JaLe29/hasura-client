/* eslint-disable no-console */
import axios from 'axios';
import type { SelectOptions, UpdateOptions, ClientOptions, ObjectPathsWithArray, DeepPick } from './types';
import { toPayload, toEnumPayload, toOrderBy, resolveFields } from './utils';

const BASE_REQUEST_HEADERS = {
	'content-type': 'application/json',
};

export class Client<S = {}, I = {}, U = {}> {
	constructor(private readonly options: ClientOptions) {}

	private getHeaders(): Record<string, string> {
		return { ...(this.options.customHeaders ?? {}), ...BASE_REQUEST_HEADERS };
	}

	private getRootQueryName(operation: 'select' | 'update' | 'insert' | 'delete', entityName: string): string {
		if (operation === 'select') {
			return entityName;
		}
		return `${operation}_${entityName}`;
	}

	async insert<
		EntityTypeInsert extends keyof I,
		EntityTypeSelect extends keyof S,
		ResponseKeys extends ObjectPathsWithArray<S[EntityTypeSelect]>,
	>(
		entityName: EntityTypeSelect,
		objects: I[EntityTypeInsert] | I[EntityTypeInsert][],
		fields: ResponseKeys[],
	): Promise<DeepPick<S[EntityTypeSelect], ResponseKeys>[]> {
		const rootQueryName = this.getRootQueryName('insert', entityName as string);
		const graphqlQuery = {
			query: `
				mutation {
					${rootQueryName} (objects: ${toPayload(objects)}) {
						returning {
							${fields.join('\n')}
						}
					}
				}
			`,
		};

		const r = await axios.post(this.options.host, graphqlQuery, { headers: this.getHeaders() });
		return r.data.data[rootQueryName].returning;
	}

	async update<
		EntityTypeUpdate extends keyof U,
		EntityTypeSelect extends keyof S,
		ResponseKeys extends ObjectPathsWithArray<S[EntityTypeSelect]>,
	>(
		entityName: EntityTypeSelect,
		objects: U[EntityTypeUpdate] | U[EntityTypeUpdate][],
		fields: ResponseKeys[],
		options: UpdateOptions = {},
	): Promise<DeepPick<S[EntityTypeSelect], ResponseKeys>[]> {
		const { where } = options;
		const rootQueryName = this.getRootQueryName('update', entityName as string);
		const graphqlQuery = {
			query: `
				mutation {
					${rootQueryName} (where: ${toPayload(where)}, _set: ${toPayload(objects)}) {
						returning {
							${fields.join('\n')}
						}
					}
				}
			`,
		};

		const r = await axios.post(this.options.host, graphqlQuery, { headers: this.getHeaders() });
		return r.data.data[rootQueryName].returning;
	}

	async select<EntityTypeSelect extends keyof S, ResponseKeys extends ObjectPathsWithArray<S[EntityTypeSelect]>>(
		entityName: EntityTypeSelect,
		fields: ResponseKeys[],
		options: SelectOptions = {},
	): Promise<DeepPick<S[EntityTypeSelect], ResponseKeys>[]> {
		const { offset, limit, where, orderBy } = options;
		const rootQueryName = this.getRootQueryName('select', entityName as string);
		const graphqlQuery = {
			query: `
				query ($limit: Int, $offset: Int) {
					${rootQueryName} (
						limit: $limit,
						offset: $offset,
						${where ? `where: ${toPayload(where)},` : ''}
						${orderBy ? `order_by: ${toEnumPayload(toOrderBy(orderBy))},` : ''}
					) {
						${resolveFields(fields as unknown as string[])}
					}
				}
			`,
			variables: {
				limit,
				offset,
			},
		};

		if (this.options.debug) {
			console.log(graphqlQuery.query);
		}

		const r = await axios.post(this.options.host, graphqlQuery, { headers: this.getHeaders() });
		return r.data.data[rootQueryName] as any;
	}
}
