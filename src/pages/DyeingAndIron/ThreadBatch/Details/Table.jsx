import { useMemo } from 'react';

import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { DateTime, LinkWithCopy } from '@/ui';

export default function Index({ batch_entry }) {
	const total = batch_entry?.reduce(
		(acc, item) => {
			acc.quantity += item.quantity;
			acc.carton += item.total_carton;
			acc.expected += item.quantity * item.max_weight;
			acc.actual += item.yarn_quantity;
			return acc;
		},
		{
			quantity: 0,
			carton: 0,
			expected: 0,
			actual: 0,
		}
	);
	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				cell: (info) => {
					const { order_info_uuid } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={order_info_uuid}
							uri={`/thread/order-info`}
						/>
					);
				},
			},
			{
				accessorKey: 'recipe_name',
				header: 'Recipe',
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
				accessorKey: 'bleaching',
				header: 'Bleaching',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'count_length',
				header: 'Count Length',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'quantity',
				header: 'QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_carton',
				header: 'Carton',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => row.quantity * row.max_weight,
				accessorKey: 'expected_yarn',
				header: 'Expected Yarn',
				enableColumnFilter: false,
				cell: (info) => info.getValue().toFixed(4),
			},
			{
				accessorKey: 'yarn_quantity',
				header: 'Yarn QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
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
		<ReactTableTitleOnly
			title='Details'
			data={batch_entry}
			columns={columns}>
			<tr className='text-lg font-bold'>
				<th className='pe-4 text-right' colSpan={6}>
					Total
				</th>
				<td className='ps-3'>{total?.quantity}</td>
				<td className='ps-3'>{total?.carton}</td>
				<td className='ps-3'>{total?.expected.toFixed(4)}</td>
				<td className='ps-3'>{total?.actual.toFixed(4)}</td>
			</tr>
		</ReactTableTitleOnly>
	);
}
