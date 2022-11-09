export enum OrderType {
	DESC = 'desc',
	ASC = 'asc',
}

export type Unpack<A> = A extends Array<infer E> ? E : A;

export interface SelectOptions {
	limit?: number;
	offset?: number;
	orderBy?: Record<string, OrderType>;
	where?: Where;
}

export interface UpdateOptions {
	where?: Where;
}

export interface ClientOptions {
	host: string;
	customHeaders?: Record<string | 'x-hasura-admin-secret', string>;
	debug?: boolean;
}

const LEAF_OPERATORS = ['_and', '_or'] as const;

const PROPERTY_OPERATORS = ['_eq', '_gt', '_gte', '_lt', '_lte', '_in', '_like'] as const;

type WhereLeaf = Partial<Record<typeof PROPERTY_OPERATORS[number], PropertyValue>> | { [P in PropertyName]: WhereLeaf };

type PropertyName = string;

type PropertyFinalValue = string | number | boolean;
type PropertyValue = PropertyFinalValue[] | PropertyFinalValue;
type WhereRoot = PropertyName | typeof LEAF_OPERATORS[number];
type Where = Record<WhereRoot, WhereLeaf>;
