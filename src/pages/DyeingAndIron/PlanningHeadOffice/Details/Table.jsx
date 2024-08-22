import ReactTable from '@/components/Table';

import { DateTime } from '@/ui';
import { useMemo } from 'react';

export default function Index({ planning_entry }) {

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
				accessorKey: 'item_description',
				header: 'Item Description',
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
				accessorKey: 'size',
				header: 'Size (CM)',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'order_quantity',
				header: 'Order Quantity',
				enableColumnFilter: false,
				cell: info => Number(info.getValue())
			},
			{
				accessorKey: 'balance_factory_quantity',
				header: 'Balanced Factory',
				enableColumnFilter: false,
				cell: info => Number(info.getValue())
			},
			{
				accessorKey: 'factory_quantity',
				header: 'Factory Quantity',
				enableColumnFilter: false,
				cell: info => Number(info.getValue())
			},
			{
				accessorKey: 'factory_remarks',
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
		[planning_entry]
	);

	return (
		<ReactTable
			title='Details'
			data={planning_entry}
			columns={columns}
			extraClass='py-2'
			showTitleOnly
		/>
	);
}
