// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import gqlPrettier from 'graphql-prettier';
import { OrderType } from './types';

export const prettyGql = (gql: string): string => gqlPrettier(gql);

export const set = (o: any, path: string, v: any): void => {
	const pathParts = path.split('.');

	let iterator = o;
	pathParts.forEach((p, i) => {
		if (!iterator[p]) {
			iterator[p] = {};
		}
		if (i === pathParts.length - 1) {
			iterator[p] = v;
		}
		iterator = iterator[p];
	});
};

export const toPayload = (d: any): string => JSON.stringify(d).replace(/"([^"]+)":/g, '$1:');

export const resolveFields = (fields: string[]): string => {
	const fieldsMap = fields.reduce((acc, v) => {
		const cpy = { ...acc };
		set(cpy, v, true);
		return cpy;
	}, {});

	const resolveFieldsMap = (f: any): string => {
		let gql = '';
		Object.entries(f).forEach(([v, k]) => {
			if (k === true) {
				gql += ` ${v} `;
				return;
			}
			gql += ` ${v} { ${resolveFieldsMap(k)} } `;
		});

		return gql;
	};

	return resolveFieldsMap(fieldsMap);
};

export const toOrderBy = (orderBy: Record<string, 'asc' | 'desc'>): Record<string, OrderType> =>
	Object.keys(orderBy).reduce(
		(acc, v) => ({ ...acc, [v]: orderBy[v] === 'desc' ? OrderType.DESC : OrderType.ASC }),
		{},
	);

export const toEnumPayload = (d: any): string =>
	JSON.stringify(d)
		.replace(/"([^"]+)":/g, '$1:')
		.replace(/"/g, '');
