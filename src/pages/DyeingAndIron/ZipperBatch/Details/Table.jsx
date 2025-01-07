import { useMemo } from 'react';

import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { DateTime, LinkWithCopy } from '@/ui';

import { getRequiredTapeKg } from '@/util/GetRequiredTapeKg';

export default function Index({ dyeing_batch_entry }) {
	const total = dyeing_batch_entry?.reduce(
		(acc, item) => {
			acc.quantity += item?.quantity;
			acc.raw_tape += getRequiredTapeKg({
				row: item,
				type: 'raw',
				input_quantity: item.quantity,
			});
			acc.actual += item?.given_production_quantity_in_kg;
			acc.dyed_tape += getRequiredTapeKg({
				row: item,
				type: 'dyed',
				input_quantity: item.quantity,
			});

			return acc;
		},
		{
			quantity: 0,
			raw_tape: 0,
			actual: 0,
			dyed_tape: 0,
		}
	);

	console.log(total);

	const columns = useMemo(
		() => [
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
				accessorKey: 'quantity',
				header: 'Batch QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => getRequiredTapeKg({ row, type: 'raw' }),
				id: 'raw_tape_req_kg',
				header: (
					<>
						Raw Tape
						<br /> Req (Kg)
					</>
				),
				enableColumnFilter: false,
				enableSorting: true,
				cell: (info) => info.getValue().toFixed(3),
			},
			{
				accessorKey: 'given_production_quantity_in_kg',
				header: (
					<>
						Prod Tape
						<br /> (Kg)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => getRequiredTapeKg({ row, type: 'dyed' }),
				id: 'dyed_tape_req_kg',
				header: (
					<>
						Dyed Tape
						<br /> Req (Kg)
					</>
				),
				enableColumnFilter: false,
				enableSorting: true,
				cell: (info) => info.getValue().toFixed(3),
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
			columns={columns}>
			<tr className='text-lg font-bold'>
				<th className='pe-4 text-right' colSpan={5}>
					Total
				</th>
				<td className='ps-3'>{total?.quantity}</td>
				<td className='ps-3'>{total?.raw_tape.toFixed(4)}</td>
				<td className='ps-3'>{total?.actual.toFixed(4)}</td>
				<td className='ps-3'>{total?.dyed_tape.toFixed(4)}</td>
			</tr>
		</ReactTableTitleOnly>
	);
}
