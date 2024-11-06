import { useMemo } from 'react';

import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { DateTime, LinkWithCopy } from '@/ui';

export default function Index({ dyeing_batch_entry }) {
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
				cell: (info) => {
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={info.getValue()}
							uri='/order/details'
						/>
					);
				},
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
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'balance_quantity',
				header: 'Balanced Batch',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'quantity',
				header: 'Batch QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: 'given_production_quantity',
			// 	header: 'Production QTY',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorKey: 'given_production_quantity_in_kg',
				header: 'Production QTY (Kg)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'remarks',
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
		[dyeing_batch_entry]
	);

	return (
		<ReactTableTitleOnly
			title='Details'
			data={dyeing_batch_entry}
			columns={columns}
		/>
	);
}
