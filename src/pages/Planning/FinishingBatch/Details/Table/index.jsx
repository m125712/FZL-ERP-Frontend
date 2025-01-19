import { useMemo } from 'react';

import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { DateTime, LinkWithCopy } from '@/ui';

export default function Table({ entries }) {
	const total_qty = entries.reduce(
		(a, b) => {
			a.batchQty += b.batch_quantity;
			a.balanceQty += b.balance_quantity;

			return a;
		},
		{
			batchQty: 0,
			balanceQty: 0,
		}
	);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'style',
				header: 'Style',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'color',
				header: 'Color',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'bleaching',
				header: 'Bleaching',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'size',
				header: 'Size',
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
				accessorKey: 'batch_quantity',
				header: 'Batch QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'balance_quantity',
				header: 'Balance',
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
		[entries]
	);

	return (
		<div>
			<ReactTableTitleOnly
				title='Finishing Batch Details'
				data={entries}
				columns={columns}>
				<tr className='bg-slate-200 font-semibold'>
					<td
						className='px-4 py-2 text-right text-sm font-semibold'
						colSpan={5}>
						Total:
					</td>
					<td className='px-3 py-2 text-sm'>{total_qty.batchQty}</td>
					<td className='px-3 py-2 text-sm'>
						{total_qty.balanceQty}
					</td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
			</ReactTableTitleOnly>
		</div>
	);
}
