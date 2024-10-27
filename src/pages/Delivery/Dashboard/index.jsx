import { useEffect, useMemo } from 'react';
import { useDeliveryDashboard } from '@/state/Delivery';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { DateTime } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function DeliveryDashboard() {
	const { data, isLoading, url } = useDeliveryDashboard();

	const info = new PageInfo('Delivery Dashboard', url, 'delivery__dashboard');
	const haveAccess = useAccess('delivery__dashboard');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'challan_number',
				header: 'Challan Number',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'packing_list_number',
				header: 'Packing List Number',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'order_no',
				header: 'Order No',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
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
				accessorKey: 'size',
				header: 'Size',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'packing_list',
				header: 'Packing List',
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
				accessorKey: 'status',
				header: 'Status',
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

	return (
		<div>
			<ReactTable title={info.getTitle()} data={data} columns={columns} />
		</div>
	);
}
