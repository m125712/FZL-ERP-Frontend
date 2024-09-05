import ReactTable from '@/components/Table';
import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';

import { DateTime } from '@/ui';
import { useMemo } from 'react';

export default function Index({ order_info_entry }) {
	console.log(order_info_entry);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'po',
				header: 'PO',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'shade_recipe_name',
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
			columns={columns}
		/>
	);
}
