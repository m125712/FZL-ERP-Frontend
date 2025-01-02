import { useEffect, useMemo } from 'react';
import { usePIToBeSubmitted } from '@/state/Report';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { DateTime, LinkWithCopy, StatusButton } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function Index() {
	const { data, isLoading, url } = usePIToBeSubmitted();
	const info = new PageInfo(
		'PI To Be Submitted',
		url,
		'report__pi_to_be_submitted'
	);

	const haveAccess = useAccess('report__pi_to_be_submitted');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'name',
				header: 'Party.',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => {
					const { order_object } = row;
					return order_object.map((order) => {
						return order.label;
					});
				},
				id: 'order_object',
				header: 'O/N',
				width: 'w-40',
				enableColumnFilter: false,
				cell: (info) => {
					const orderNumbers = info.row.original.order_object;
					return orderNumbers?.map((orderNumber) => {
						if (orderNumber === null) return;
						const isThreadOrder = orderNumber.label?.includes('ST');
						const number = orderNumber.label;
						const uuid = orderNumber.uuid;
						return (
							<LinkWithCopy
								key={number}
								title={number}
								id={isThreadOrder ? uuid : number}
								uri={
									isThreadOrder
										? '/thread/order-info'
										: '/order/details'
								}
							/>
						);
					});
				},
			},
			{
				accessorKey: 'total_quantity',
				header: 'Order  QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'total_quantity_value',
				header: 'Value',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_delivered',
				header: 'Delivered',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_delivered_value',
				header: 'Value',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_pi',
				header: 'PI Qty',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_pi_value',
				header: 'Value',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_non_pi',
				header: 'Non PI Qty',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'total_non_pi_value',
				header: 'Value',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
			<ReactTable
				title={info.getTitle()}
				accessor={false}
				data={data}
				columns={columns}
				extraClass={'py-0.5'}
			/>
		</>
	);
}
