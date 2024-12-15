import { useMemo } from 'react';

import ReactTable from '@/components/Table';
import { DateTime, LinkWithCopy } from '@/ui';

export default function index({ data }) {
	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => (
					<LinkWithCopy
						title={info.getValue()}
						id={info.getValue()}
						uri={`/order/details`}
					/>
				),
			},
			{
				accessorKey: 'item_description',
				header: 'Item',
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => {
					const { order_number, order_description_uuid } =
						info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={`${order_number}/${order_description_uuid}`}
							uri={`/order/details`}
						/>
					);
				},
			},
			{
				accessorKey: 'order_type',
				header: 'Type',
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'recipe_id',
				header: 'Recipe',
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'style',
				header: 'Style',
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'color',
				header: 'Color',
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'size',
				header: 'Size',
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'unit',
				header: 'Unit',
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'order_quantity',
				header: 'Order QTY',
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'balance_quantity',
				header: 'Balance',
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);

	// if (isLoading)
	// 	return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable
				title={'Order Overview'}
				data={data}
				columns={columns}
			/>
		</div>
	);
}
