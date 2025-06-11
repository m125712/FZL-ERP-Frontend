import { useEffect, useMemo, useState } from 'react';
import { useDeliveryThreadDashboard } from '@/state/Delivery';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { LinkWithCopy, StatusSelect } from '@/ui';

import PageInfo from '@/util/PageInfo';

import { options } from './utils';

export default function Index() {
	const [status, setStatus] = useState('in_warehouse');
	const { data, isLoading, url } = useDeliveryThreadDashboard(
		`type=${status}`
	);

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
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
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
		<ReactTable
			title={info.getTitle()}
			data={data}
			columns={columns}
			extraButton={
				<StatusSelect
					status={status}
					setStatus={setStatus}
					options={options}
				/>
			}
		/>
	);
}
