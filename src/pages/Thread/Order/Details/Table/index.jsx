import { useMemo } from 'react';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
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
			// {
			// 	accessorKey: 'po',
			// 	header: 'PO',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			// {
			// 	accessorKey: 'recipe_name',
			// 	header: 'Shade',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorKey: 'id',
				header: 'ID',
				enableColumnFilter: false,
				cell: (info) => info.row.index + 1,
			},
			{
				accessorKey: 'status',
				header: () => (
					<span>
						Status <br /> (Price/Swatch)
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
				accessorKey: 'production_quantity',
				header: 'Production QTY',
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
				accessorKey: 'delivered',
				header: 'Delivered QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'short_quantity',
				header: 'Short QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'reject_quantity',
				header: 'Reject QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'warehouse',
				header: 'Warehouse QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'company_price',
				header: 'Company Price',
				enableColumnFilter: false,
				hidden: !useAccess('thread__order_info_in_details').includes(
					'show_price'
				),
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_price',
				header: 'Party Price',
				enableColumnFilter: false,
				hidden: !useAccess('thread__order_info_in_details').includes(
					'show_price'
				),
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
		<ReactTableTitleOnly
			title='Details'
			data={order_info_entry}
			columns={columns}>
			<tr className='text-sm'>
				<td colSpan='6' className='py-2 text-right'>
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
		</ReactTableTitleOnly>
	);
}
