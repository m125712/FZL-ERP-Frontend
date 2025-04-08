import { useMemo } from 'react';

import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { DateTime, LinkWithCopy } from '@/ui';

export default function Table({ entries }) {
	const total_qty = entries.reduce(
		(a, b) => {
			a.batchQty += b.batch_quantity;
			a.teethMolding += b.teeth_molding_prod;
			a.teethColoring += b.teeth_coloring_stock;
			a.finishingStock += b.finishing_stock;
			a.finishingProd += b.finishing_prod;
			a.balanceQty += b.batch_quantity - b.finishing_prod;

			return a;
		},
		{
			batchQty: 0,
			teethMolding: 0,
			teethColoring: 0,
			finishingStock: 0,
			finishingProd: 0,
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
			// {
			// 	accessorKey: 'balance_quantity',
			// 	header: 'Balance',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorKey: 'teeth_molding_prod',
				header: (
					<>
						Teeth <br /> Molding
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'teeth_coloring_stock',
				header: (
					<>
						Teeth <br /> Coloring
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'finishing_stock',
				header: (
					<>
						Finishing <br /> Stock
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'finishing_prod',
				header: (
					<>
						Finishing <br /> Prod
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => row.batch_quantity - row.finishing_prod,
				id: 'balance',
				header: 'Balance',
				enableColumnFilter: false,
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
				columns={columns}
			>
				<tr className='bg-slate-200 font-semibold'>
					<td
						className='px-4 py-2 text-right text-sm font-semibold'
						colSpan={5}
					>
						Total:
					</td>
					<td className='px-3 py-2 text-sm'>{total_qty.batchQty}</td>
					<td className='px-3 py-2 text-sm'>
						{total_qty.teethMolding}
					</td>
					<td className='px-3 py-2 text-sm'>
						{total_qty.teethColoring}
					</td>
					<td className='px-3 py-2 text-sm'>
						{total_qty.finishingStock}
					</td>
					<td className='px-3 py-2 text-sm'>
						{total_qty.finishingProd}
					</td>
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
