import { useMemo } from 'react';
import { useAccess } from '@/hooks';

import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { DateTime, LinkWithCopy, StatusButton } from '@/ui';

import { getRequiredTapeKg } from '@/util/GetRequiredTapeKg';

export default function Index({ dyeing_batch_entry }) {
	const haveAccess = useAccess('dyeing__zipper_batch');

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

	const columns = useMemo(
		() => [
			{
				accessorKey: 'dyeing_batch_entry_uuid',
				header: 'uuid',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('show_developer'),
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'order_number',
				header: 'Order ID',
				width: 'w-36',
				enableSorting: true,
				cell: (info) => {
					const { order_number, order_type, bleaching } =
						info.row.original;
					const isBleached = bleaching === 'bleach';
					return (
						<div className='flex flex-col gap-1'>
							<LinkWithCopy
								title={info.getValue()}
								id={order_number}
								uri='/order/details'
							/>

							<div className='grid grid-cols-2 gap-1'>
								<span>Type:</span>
								<span>{order_type}</span>
								<span>Bleach:</span>
								<StatusButton
									value={isBleached}
									className='h-4 min-h-4 pl-1 pr-1 text-xs'
								/>
							</div>
						</div>
					);
				},
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: true,
				width: 'w-36',
				enableSorting: true,
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
				accessorKey: 'color_ref',
				header: 'Color Ref',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'recipe_name',
				header: 'Recipe',
				enableColumnFilter: true,
				enableSorting: true,
				width: 'w-44',
				cell: (info) => {
					const {
						recipe_name,
						approved,
						approved_date,
						is_pps_req,
						is_pps_req_date,
					} = info.row.original;
					return (
						<div className='flex flex-col gap-1'>
							<span>{recipe_name}</span>
							<div className='grid grid-cols-3 gap-1'>
								Bulk:
								<StatusButton
									value={approved}
									className='h-4 min-h-4 pl-1 pr-1 text-xs'
								/>
								<DateTime date={approved_date} isTime={false} />
								PP:
								<StatusButton
									value={is_pps_req}
									className='h-4 min-h-4 pl-1 pr-1 text-xs'
								/>
								<DateTime
									date={is_pps_req_date}
									isTime={false}
								/>
							</div>
						</div>
					);
				},
			},
			{
				accessorKey: 'size',
				header: 'Size',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'unit',
				header: 'Unit',
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
			columns={columns}
		>
			<tr className='text-lg font-bold'>
				<th
					className='pe-4 text-right'
					colSpan={haveAccess?.includes('show_price') ? 8 : 7}
				>
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
