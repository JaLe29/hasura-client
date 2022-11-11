import { expectTypeOf } from 'expect-type';
import type { DeepPick, ObjectPathsWithArray } from './types';

describe('types', () => {
	it('DeepPick should pick book', () => {
		expectTypeOf<
			DeepPick<
				{
					id: string;
					book: { bookName: string };
					books: { booksName: string }[];
				},
				'book.bookName'
			>
		>().toEqualTypeOf<{ book: { bookName: string } }>();
	});

	it('DeepPick should pick book and books', () => {
		expectTypeOf<
			DeepPick<
				{
					id: string;
					book: { bookName: string };
					books: { booksName: string }[];
				},
				'book.bookName' | 'books.booksName'
			>
		>().toEqualTypeOf<{ book: { bookName: string }; books: { booksName: string }[] }>();
	});

	it('ObjectPathsWithArray should return paths', () => {
		expectTypeOf<
			ObjectPathsWithArray<{ id: string; book: { bookName: string }; books: { booksName: string }[] }>
		>().toEqualTypeOf<'book.bookName' | 'id' | 'books.booksName'>();
	});
});
