import { useMemo } from 'react';

import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { LinkWithCopy } from '@/ui';

export default function Index({ challan, item_for }) {
	const columns = useMemo(
		() => [
			{
				accessorKey: 'packing_number',
				header: 'Packing Number',
				cell: (info) => {
					const { packing_list_uuid } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={packing_list_uuid}
							uri='/delivery/packing-list'
						/>
					);
				},
			},
			{
				accessorKey: 'item_description',
				header: () =>
					item_for === 'thread' || item_for === 'sample_thread'
						? 'Count'
						: 'Item Description',
				cell: (info) => info.getValue(),
				enableColumnFilter: false,
			},
			{
				accessorKey: 'style',
				header: 'Style',
				cell: (info) => info.getValue(),
				enableColumnFilter: false,
			},
			{
				accessorKey: 'color',
				header: 'Color',
				cell: (info) => info.getValue(),
				enableColumnFilter: false,
			},
			{
				accessorKey: 'size',
				header: () =>
					item_for === 'thread' || item_for === 'sample_thread'
						? 'Length'
						: 'Size',
				cell: (info) => info.getValue(),
				enableColumnFilter: false,
			},
			{
				accessorKey: 'is_inch',
				header: 'Unit',
				cell: (info) =>
					item_for === 'thread' ||
					item_for === 'sample_thread' ||
					item_for === 'tape'
						? 'Meter'
						: info.getValue() === 1
							? 'Inch'
							: 'Cm',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'delivered',
				header: 'Delivered',
				cell: (info) => info.getValue(),
				enableColumnFilter: false,
			},
			{
				accessorKey: 'quantity',
				header:
					item_for === 'thread' || item_for === 'sample_thread'
						? 'Qty(cone)'
						: item_for === 'tape'
							? 'Qty(cm)'
							: 'Qty(pcs)',
				cell: (info) => info.getValue(),
				enableColumnFilter: false,
			},
			{
				accessorKey: 'poli_quantity',
				header: 'Poly QTY',
				cell: (info) => info.getValue(),
				enableColumnFilter: false,
			},
			{
				accessorKey: 'short_quantity',
				header: 'Short QTY',
				cell: (info) => info.getValue(),
				enableColumnFilter: false,
			},
			{
				accessorKey: 'reject_quantity',
				header: 'Reject QTY',
				cell: (info) => info.getValue(),
				enableColumnFilter: false,
			},

			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[challan]
	);

	const totalQty = challan.reduce((a, b) => a + Number(b.quantity), 0);
	const totalPolyQty = challan.reduce(
		(a, b) => a + Number(b.poli_quantity),
		0
	);

	return (
		<ReactTableTitleOnly title='Details' data={challan} columns={columns}>
			<tr className='text-sm'>
				<td colSpan='7' className='py-2 text-right'>
					Total
				</td>
				<td className='pl-3 text-left font-semibold'>{totalQty}</td>

				{/* <td className='text-right'>Total Poly QTY</td> */}
				<td className='pl-3 text-left font-semibold'>
					{Number(totalPolyQty).toLocaleString()}
				</td>
			</tr>
		</ReactTableTitleOnly>
	);
}
