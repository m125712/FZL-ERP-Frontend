import ReactTable from '@/components/Table';

import { DateTime } from '@/ui';
import { useMemo } from 'react';

export default function Index({ order_info_entry }) {
	// console.log(thread_order_info_entry);

	const columns = useMemo(
		() => [
			// {
			// 	accessorKey: 'lab_ref',
			// 	header: 'Lab Ref',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorKey: 'po',
				header: 'PO',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'shade_recipe_uuid',
				header: 'Shade',
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
				accessorKey: 'count_length_uuid',
				header: 'Count Length',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'quantity',
				header: 'Quantity',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'company_price',
				header: 'Company Price',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_price',
				header: 'Party Price',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: 'swatch_status',
			// 	header: 'Swatch Status',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			// {
			// 	accessorKey: 'swatch_approval_date',
			// 	header: 'Swatch Approval Date',
			// 	enableColumnFilter: false,
			// 	cell: (info) => <DateTime date={info.getValue()} />,
			// },
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
		[order_info_entry]
	);

	return (
		<ReactTable
			title='Details'
			data={order_info_entry}
			columns={columns}
			extraClass='py-2'
			showTitleOnly
		/>
	);
}
