import ReactTable from '@/components/Table';

import { DateTime } from '@/ui';
import { useMemo } from 'react';

export default function Index({ batch_entry }) {

	const columns = useMemo(
		() => [
			// {
			// 	accessorKey: 'recipe_name',
			// 	header: 'Recipe Name',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'shade_recipe_name',
				header: 'Shade Recipe',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'style',
				header: 'Style',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'color',
				header: 'Color',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'count_length',
				header: 'Count Length',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'po',
				header: 'PO',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'order_quantity',
				header: 'Order QTY',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
			},
			{
				accessorKey: 'balance_quantity',
				header: 'Balance',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
			},
			{
				accessorKey: 'quantity',
				header: 'QTY',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
			},
			
			{
				accessorKey: 'batch_remarks',
				header: 'Remarks',
				enableColumnFilter: false,
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
		[batch_entry]
	);

	return (
		<ReactTable
			title='Details'
			data={batch_entry}
			columns={columns}
			extraClass='py-2'
			showTitleOnly
		/>
	);
}
