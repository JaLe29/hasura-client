import type { UnionToIntersection } from 'type-fest';

export enum OrderType {
	DESC = 'desc',
	ASC = 'asc',
}

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

type Unpack<A> = A extends Array<infer E> ? E : A;

type AnyArray = any[] | ReadonlyArray<any>;

type AnyFunction = (...args: any[]) => any;

type Primitive = number | string | boolean | null | undefined;

type UnionForAny<T> = T extends never ? 'A' : 'B';

type IsStrictlyAny<T> = UnionToIntersection<UnionForAny<T>> extends never ? true : false;

export type ObjectPathsWithArray<Obj, KeyPrefix extends string = '', Depth extends number = 3> = Depth extends never
	? never
	: true extends IsStrictlyAny<Obj>
	? never
	: Obj extends Primitive | Date | AnyFunction
	? never
	: {
			[K in keyof Unpack<Obj> & string]: Unpack<Obj>[K] extends Primitive
				? `${KeyPrefix}${K}`
				:
						| never
						| ObjectPathsWithArray<
								Unpack<Obj[K & keyof Obj]>,
								`${KeyPrefix}${K}${Obj[K & keyof Obj] extends AnyArray ? `` : ''}.`,
								[never, 0, 1, 2, 3][Depth]
						  >;
	  }[keyof Unpack<Obj> & string];

export type DeepPick<T, K extends string> = T extends object
	? {
			[P in Head<K> & keyof T]: T[P] extends readonly unknown[]
				? DeepPick<T[P][number], Tail<Extract<K, `${P}.${string}`>>>[]
				: DeepPick<T[P], Tail<Extract<K, `${P}.${string}`>>>;
	  }
	: T;

type Head<T extends string> = T extends `${infer First}.${string}` ? First : T;

type Tail<T extends string> = T extends `${string}.${infer Rest}` ? Rest : never;

const LEAF_OPERATORS = ['_and', '_or'] as const;

const PROPERTY_OPERATORS = ['_eq', '_gt', '_gte', '_lt', '_lte', '_in', '_like'] as const;

type WhereLeaf = Partial<Record<typeof PROPERTY_OPERATORS[number], PropertyValue>> | { [P in PropertyName]: WhereLeaf };

type PropertyName = string;

type PropertyFinalValue = string | number | boolean;
type PropertyValue = PropertyFinalValue[] | PropertyFinalValue;
type WhereRoot = PropertyName | typeof LEAF_OPERATORS[number];
type Where = Record<WhereRoot, WhereLeaf>;
