import { useEffect, useMemo } from 'react';
import { useDeliveryZipperDashboard } from '@/state/Delivery';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { DateTime, LinkWithCopy } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function Index() {
	const { data, isLoading, url } = useDeliveryZipperDashboard();

	const info = new PageInfo(
		'Delivery/Zipper Dashboard',
		url,
		'delivery__dashboard'
	);
	const haveAccess = useAccess('delivery__dashboard');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'challan_number',
				header: 'Challan Number',
				cell: (info) => {
					const { challan_uuid } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={challan_uuid}
							uri='/delivery/zipper-challan'
						/>
					);
				},
			},
			{
				accessorKey: 'packing_list_number',
				header: 'Packing List Number',
				cell: (info) => {
					const { packing_list_uuid } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={packing_list_uuid}
							uri='/delivery/zipper-packing-list'
						/>
					);
				},
			},
			,
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				cell: (info) => (
					<LinkWithCopy
						title={info.getValue()}
						id={info.getValue()}
						uri='/order/details'
					/>
				),
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: false,
				cell: ({ row }) => {
					const { order_description_uuid, order_number } =
						row.original;
					return (
						<LinkWithCopy
							title={row.getValue('item_description')}
							id={order_description_uuid}
							uri={`/order/details/${order_number}`}
						/>
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
				accessorKey: 'size',
				header: 'Size',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'packing_list_quantity',
				header: 'Packing List Qty',
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
