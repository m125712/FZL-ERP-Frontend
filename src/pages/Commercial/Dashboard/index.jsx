import { useEffect, useMemo } from 'react';
import { useCommercialDashboard } from '@/state/Commercial';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { LinkWithCopy } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function Index() {
	const { data, isLoading, url } = useCommercialDashboard();
	// console.log(data);

	const info = new PageInfo('Dashboard', url, 'commercial__dashboard');
	const haveAccess = useAccess('commercial__dashboard');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'id',
				header: 'Cash Invoice ID',
				cell: (info) => {
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={info.getValue()}
							uri='/commercial/pi-cash'
						/>
					);
				},
			},

			{
				accessorFn: (row) => {
					const { order_number } = row;
					return order_number;
				},
				id: 'order_number',
				header: 'O/N',
				width: 'w-28',
				enableColumnFilter: false,
				cell: (info) => {
					const orderNumbers = info.getValue();
					return orderNumbers?.map((orderNumber) => {
						if (
							orderNumber.thread_order_info_uuid === null ||
							orderNumber.order_info_uuid === null
						)
							return;
						const isThreadOrder =
							orderNumber.order_number?.includes('ST');
						const number = orderNumber.order_number;
						const uuid = isThreadOrder
							? orderNumber.thread_order_info_uuid
							: orderNumber.order_info_uuid;
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
				accessorKey: 'value',
				header: 'Value',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'receive_amount',
				header: 'Receive amount',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return <ReactTable title={info.getTitle()} data={data} columns={columns} />;
}
