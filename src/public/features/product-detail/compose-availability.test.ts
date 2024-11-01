import { composeAvailability } from './compose-availability';

test('Returns the schema for in stock', () => {
	expect(composeAvailability('active', 5)).toBe('https://schema.org/InStock');
});

test('Returns the schema for in stock when inventory control is ignored', () => {
	expect(composeAvailability('active')).toBe('https://schema.org/InStock');
});

test('Returns the schema for backorder', () => {
	expect(composeAvailability('backordered')).toBe(
		'https://schema.org/BackOrder'
	);
});

test('Returns the schema for discontinued', () => {
	expect(composeAvailability('discontinued')).toBe(
		'https://schema.org/Discontinued'
	);
});

test('Returns the schema for out of stock', () => {
	expect(composeAvailability('active', 0)).toBe(
		'https://schema.org/OutOfStock'
	);
});
