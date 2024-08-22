import ReactTable from '@/components/Table';

import { DateTime } from '@/ui';
import { useMemo } from 'react';

export default function Index({ shade_recipe_entry }) {
	const columns = useMemo(
		() => [
			{
				accessorKey: 'material_name',
				header: 'Material',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'quantity',
				header: 'Quantity',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
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
		<ReactTable
			headerClassName='px-4 py-3 bg-secondary-content/5 mb-0 rounded-t'
			title='Details'
			data={shade_recipe_entry}
			columns={columns}
			extraClass='py-2'
			showTitleOnly
		/>
	);
}
