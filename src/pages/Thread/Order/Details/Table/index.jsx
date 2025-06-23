import { useMemo } from 'react';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { DateTime, StatusButton } from '@/ui';

export default function Index({ order_info_entry }) {
	const totalQty = order_info_entry.reduce(
		(acc, cur) => acc + cur.quantity,
		0
	);

	const totalProductionQty = order_info_entry.reduce(
		(acc, cur) => acc + cur.production_quantity,
		0
	);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'index',
				header: 'ID',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'status',
				header: () => (
					<span>
						Status <br />
						(Price/Swatch)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => {
					const { company_price, party_price, swatch_approval_date } =
						info.row.original;
					return (
						<div className='flex items-center justify-start gap-2'>
							<StatusButton
								size='btn-xs'
								value={
									Number(company_price) > 0 &&
									Number(party_price) > 0
										? 1
										: 0
								}
								idx={info.row.index + 1}
								// showIdx={true}
							/>
							<StatusButton
								size='btn-xs'
								value={swatch_approval_date ? 1 : 0}
								idx={info.row.index + 1}
								// showIdx={true}
							/>
						</div>
					);
				},
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
				accessorKey: 'color_ref',
				header: 'Color Ref',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'recipe_name',
				header: 'Recipe',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'count_length_name',
				header: 'Count Length',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'bleaching',
				header: 'Bleaching',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'quantity',
				header: 'Quantity',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'batch_quantity',
				header: 'Batch',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'short_quantity',
				header: 'Short',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'reject_quantity',
				header: 'Reject',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'pi',
				header: 'PI QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'production_quantity',
				header: 'Production',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'warehouse',
				header: 'Warehouse',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'delivered',
				header: 'Delivered',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			...(useAccess('thread__order_info_details').includes('show_price')
				? [
						{
							accessorFn: (row) =>
								`${row.company_price || 0}/${row.party_price || 0}`,
							id: 'price',
							header: 'Price',
							enableColumnFilter: false,
							hidden: true,
							cell: (info) => info.getValue(),
						},
					]
				: []),

			{
				accessorKey: 'color_ref_entry_date',
				header: (
					<>
						Color Ref <br /> Entry
					</>
				),
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'color_ref_update_date',
				header: (
					<>
						Color Ref <br /> Update
					</>
				),
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
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
			{
				accessorKey: 'swatch_approval_date',
				header: 'Swatch Approval Date',
				enableColumnFilter: false,

				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
		],
		[order_info_entry]
	);

	return (
		<ReactTable
			title='Details'
			subtitle={
				<div className='flex flex-col'>
					<span>
						warehouse = when the packing list is warehouse received
					</span>
					<span>
						delivered = when the packing list is warehouse out
					</span>
				</div>
			}
			data={order_info_entry}
			columns={columns}
		>
			<tr className='text-sm'>
				<td colSpan='8' className='py-2 text-right'>
					Total QTY
				</td>
				<td className='pl-3 text-left font-semibold'>{totalQty}</td>

				<td className='text-left'>
					Total
					<span className='pl-1 font-semibold'>
						{totalProductionQty}
					</span>
				</td>
			</tr>
		</ReactTable>
	);
}
