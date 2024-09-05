import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';

import { DateTime } from '@/ui';
import { useMemo } from 'react';

export default function Index({ recipe_entry }) {
	// console.log(recipe_entry);

	const columns = useMemo(
		() => [
			// {
			// 	accessorKey: 'recipe_name',
			// 	header: 'Recipe Name',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorKey: 'color',
				header: 'Color',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'quantity',
				header: 'Quantity (Liter)',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
		],
		[recipe_entry]
	);

	return (
		<ReactTableTitleOnly
			title='Details'
			data={recipe_entry}
			columns={columns}
		/>
	);
}
