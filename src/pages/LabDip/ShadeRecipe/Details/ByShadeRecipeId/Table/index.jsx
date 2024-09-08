import ReactTableWithTitle from '@/components/Table/ReactTableWithTitle';

import { DateTime } from '@/ui';
import { useMemo } from 'react';

export default function Index({ shade_recipe_entry }) {
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
				cell: (info) => Number(info.getValue()).toFixed(3),
			},
			{
				accessorKey: 'unit',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
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
		[shade_recipe_entry]
	);

	return (
		<ReactTableWithTitle
			title='Details'
			data={shade_recipe_entry}
			columns={columns}
		/>
	);
}
