import ReactTableWithTitle from '@/components/Table/ReactTableWithTitle';
import { DateTime, LinkWithCopy } from '@/ui';
import { useMemo } from 'react';

export default function Index({ pi }) {
	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: false,
				cell: (info) => (
					<LinkWithCopy
						title={info.getValue()}
						id={info.getValue()}
						uri='/order/details'
					/>
				),
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: false,
				cell: (info) => {
					const { order_description_uuid, order_number } =
						info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={order_description_uuid}
							uri={`/order/details/${order_number}`}
						/>
					);
				},
			},
			{
				accessorKey: 'size',
				header: 'Size (CM)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'pi_quantity',
				header: 'QTY (PCS)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'unit_price',
				header: 'Unit Price ($)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'value',
				header: 'Value ($)',
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
		[pi]
	);

	const totalQty = pi.reduce((a, b) => Number(a + b.pi_quantity), 0);
	const totalValue = pi.reduce((a, b) => Number(a + b.value), 0);

	return (
		<ReactTableWithTitle title='Details' data={pi} columns={columns}>
			<tr className='text-sm'>
				<td colSpan='3' className='py-2 text-right'>
					Total QTY:
				</td>
				<td className='pl-3 text-left'>{totalQty}</td>

				<td className='text-right'>Total Value:</td>
				<td className='pl-3 text-left'>{totalValue}</td>
			</tr>
		</ReactTableWithTitle>
	);
}
