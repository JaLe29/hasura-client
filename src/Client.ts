import axios from 'axios';
import { Console } from './Console';
import type {
	SelectOptions,
	UpdateOptions,
	ClientOptions,
	ObjectPathsWithArray,
	DeepPick,
	NonEmptyArr,
	Where,
	AggregateOptions,
} from './types';
import { prettyGql, toPayload, toEnumPayload, toOrderBy, resolveFields } from './utils';

const BASE_REQUEST_HEADERS = {
	'content-type': 'application/json',
};

export class Client<S = {}, I = {}, U = {}> {
	constructor(private readonly options: ClientOptions) {}

	private getHeaders(): Record<string, string> {
		return { ...(this.options.customHeaders ?? {}), ...BASE_REQUEST_HEADERS };
	}

	private getRootQueryName(
		operation: 'aggregate' | 'select' | 'update' | 'insert' | 'delete',
		entityName: string,
	): string {
		if (operation === 'aggregate') {
			return `${entityName}_${operation}`;
		}
		if (operation === 'select') {
			return entityName;
		}
		return `${operation}_${entityName}`;
	}

	private async request(graphqlQuery: {
		query: string;
		variables?: { limit?: number; offset?: number };
	}): Promise<{ data: any; took: number }> {
		const start = Date.now();
		const { data } = await axios.post(this.options.host, graphqlQuery, { headers: this.getHeaders() });
		const took = Date.now() - start;

		return { data, took };
	}

	async insert<
		EntityTypeInsert extends keyof I,
		EntityTypeSelect extends keyof S,
		ResponseKeys extends ObjectPathsWithArray<S[EntityTypeSelect]>,
	>(
		entityName: EntityTypeSelect,
		objects: I[EntityTypeInsert] | I[EntityTypeInsert][],
		fields: NonEmptyArr<ResponseKeys>,
	): Promise<DeepPick<S[EntityTypeSelect], ResponseKeys>[]> {
		const rootQueryName = this.getRootQueryName('insert', entityName as string);
		const graphqlQuery = {
			query: `
				mutation {
					${rootQueryName} (objects: ${toPayload(objects)}) {
						returning {
							${resolveFields(fields)}
						}
					}
				}
			`,
		};

		if (this.options.debug) {
			Console.yellow(prettyGql(graphqlQuery.query));
		}

		const { data, took } = await this.request(graphqlQuery);

		if (this.options.debug) {
			Console.yellow(data);
			Console.green(`${took}ms`);
		}

		return data.data[rootQueryName].returning;
	}

	async update<
		EntityTypeUpdate extends keyof U,
		EntityTypeSelect extends keyof S,
		ResponseKeys extends ObjectPathsWithArray<S[EntityTypeSelect] & { _affected_rows: number }>,
	>(
		entityName: EntityTypeSelect,
		objects: U[EntityTypeUpdate] | U[EntityTypeUpdate][],
		fields: NonEmptyArr<ResponseKeys>,
		options: UpdateOptions = {},
	): Promise<DeepPick<S[EntityTypeSelect] & { affected_rows: number }, ResponseKeys>[]> {
		const { where } = options;
		const rootQueryName = this.getRootQueryName('update', entityName as string);
		const graphqlQuery = {
			query: `
				mutation {
					${rootQueryName} (where: ${toPayload(where)}, _set: ${toPayload(objects)}) {
						returning {
							${resolveFields(fields)}
						}
					}
				}
			`,
		};

		if (this.options.debug) {
			Console.yellow(prettyGql(graphqlQuery.query));
		}

		const { data, took } = await this.request(graphqlQuery);

		if (this.options.debug) {
			Console.yellow(data);
			Console.green(`${took}ms`);
		}

		return data.data[rootQueryName].returning;
	}

	async select<EntityTypeSelect extends keyof S, ResponseKeys extends ObjectPathsWithArray<S[EntityTypeSelect]>>(
		entityName: EntityTypeSelect,
		fields: NonEmptyArr<ResponseKeys>,
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
			Console.yellow(prettyGql(graphqlQuery.query));
		}

		const { data, took } = await this.request(graphqlQuery);

		if (this.options.debug) {
			Console.yellow(data);
			Console.green(`${took}ms`);
		}

		return data.data[rootQueryName] as any;
	}

	async delete<EntityTypeSelect extends keyof S, ResponseKeys extends ObjectPathsWithArray<S[EntityTypeSelect]>>(
		entityName: EntityTypeSelect,
		fields: NonEmptyArr<ResponseKeys>,
		where: Where,
	): Promise<DeepPick<S[EntityTypeSelect], ResponseKeys>[]> {
		const rootQueryName = this.getRootQueryName('delete', entityName as string);
		const graphqlQuery = {
			query: `
				mutation {
					${rootQueryName} (where: ${toPayload(where)}) {
						returning {
							${resolveFields(fields)}
						}
					}
				}
			`,
		};

		if (this.options.debug) {
			Console.yellow(prettyGql(graphqlQuery.query));
		}

		const { data, took } = await this.request(graphqlQuery);

		if (this.options.debug) {
			Console.yellow(data);
			Console.green(`${took}ms`);
		}

		return data.data[rootQueryName].returning;
	}

	async aggregate<EntityType extends keyof S>(
		entityName: EntityType,
		options: AggregateOptions = {},
	): Promise<{ aggregate: { count: number } }> {
		const { where } = options;
		const rootQueryName = this.getRootQueryName('aggregate', entityName as string);
		const graphqlQuery = {
			query: `
				query {
					${rootQueryName} ${where ? `(where: ${toPayload(where)})` : ''} {
						aggregate {
							count
						}
					}
				}
			`,
		};

		if (this.options.debug) {
			Console.yellow(prettyGql(graphqlQuery.query));
		}

		const { data, took } = await this.request(graphqlQuery);

		if (this.options.debug) {
			Console.yellow(data);
			Console.green(`${took}ms`);
		}

		return data.data[rootQueryName];
	}
}
