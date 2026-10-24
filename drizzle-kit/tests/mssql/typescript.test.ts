import { expect, test } from 'vitest';
import { createDDL } from '../../src/dialects/mssql/ddl';
import { ddlToTypeScript } from '../../src/dialects/mssql/typescript';

const identityToTs = (identity: { seed: number; increment: number }) => {
	const ddl = createDDL();
	ddl.tables.push({ schema: 'dbo', name: 'staff' });
	ddl.columns.push({
		schema: 'dbo',
		table: 'staff',
		name: 'id',
		type: 'int',
		notNull: true,
		generated: null,
		identity,
	} as any);
	return ddlToTypeScript(ddl, [], 'camel').file;
};

test('identity seed 0 is preserved', () => {
	expect(identityToTs({ seed: 0, increment: 1 })).toContain('.identity({ seed: 0 ,increment: 1 })');
});

test('identity with non-zero seed', () => {
	expect(identityToTs({ seed: 5, increment: 2 })).toContain('.identity({ seed: 5 ,increment: 2 })');
});
