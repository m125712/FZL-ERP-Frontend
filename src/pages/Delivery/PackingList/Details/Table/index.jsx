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
				accessorKey: 'style_color_size',
				header: 'Style/Color/Size',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'order_quantity',
				header: 'Order Qty',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()).toFixed(2),
			},
			{
				accessorKey: 'balance_quantity',
				header: 'Balance Qty',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()).toFixed(2),
			},
			{
				accessorKey: 'quantity',
				header: 'Qty',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()).toFixed(2),
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
