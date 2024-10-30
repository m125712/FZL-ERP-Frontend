import { useMemo } from 'react';

import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { DateTime, LinkWithCopy } from '@/ui';

export default function Index({ packing_list_entry }) {
	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_info_uuid',
				header: 'O/N',
				cell: (info) => {
					const { order_number } = info.row.original;
					return (
						<LinkWithCopy
							title={order_number}
							id={info.getValue()}
							uri='/order/details'
						/>
					);
				},
			},

			{
				accessorKey: 'item_description',
				header: 'Description',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
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
				accessorKey: 'size',
				header: 'Size',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'is_inch',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => (info.getValue() === 1 ? 'Inch' : 'Cm'),
			},
			{
				accessorKey: 'order_quantity',
				header: 'Order Qty',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'balance_quantity',
				header: 'Balance Qty',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'quantity',
				header: 'Qty(pcs)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'poli_quantity',
				header: 'Poly Qty',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created At',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[packing_list_entry]
	);

	const totalQty = packing_list_entry.reduce(
		(a, b) => a + Number(b.order_quantity),
		0
	);
	const totalQuantity = packing_list_entry.reduce(
		(a, b) => a + Number(b.quantity),
		0
	);

	return (
		<ReactTableTitleOnly
			title='Details'
			data={packing_list_entry}
			columns={columns}>
			<tr className='text-sm'>
				<td colSpan='3' className='py-2 text-right'>
					Total Order QTY
				</td>
				<td className='pl-3 text-left font-semibold'>{totalQty}</td>

				<td className='text-right'>Total QTY</td>
				<td className='pl-3 text-left font-semibold'>
					{Number(totalQuantity).toLocaleString()}
				</td>
			</tr>
		</ReactTableTitleOnly>
	);
}
