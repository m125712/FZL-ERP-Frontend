import { useMemo } from 'react';

import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { DateTime } from '@/ui';

export default function Index({ recipe_entry }) {
	const yellow = recipe_entry?.filter((e) =>
		e?.material_name.toLowerCase().includes('yellow')
	);
	const red = recipe_entry?.filter((e) =>
		e?.material_name.toLowerCase().includes('red')
	);
	const other = recipe_entry?.filter(
		(e) =>
			!e?.material_name.toLowerCase().includes('red') &&
			!e?.material_name.toLowerCase().includes('yellow')
	);
	const shade = yellow?.concat(red)?.concat(other);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'material_name',
				header: 'Dyes',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'quantity',
				header: 'Quantity (Solution %)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[shade]
	);

	return (
		<ReactTableTitleOnly title='Details' data={shade} columns={columns} />
	);
}
