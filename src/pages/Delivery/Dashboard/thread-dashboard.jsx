import { useEffect, useMemo } from 'react';
import { useDeliveryThreadDashboard } from '@/state/Delivery';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { DateTime, LinkWithCopy } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function Index() {
	const { data, isLoading, url } = useDeliveryThreadDashboard();

	const info = new PageInfo(
		'Deliver/Thread Dashboard',
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
							uri='/delivery/challan'
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
							uri='/delivery/packing-list'
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
				header: 'Count Length',
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
				accessorKey: 'packing_list_quantity',
				header: ' Qty',
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
