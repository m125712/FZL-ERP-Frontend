import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useWarehouseNotOutLog } from '@/state/Delivery';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import {
	CustomLink,
	DateTime,
	LinkWithCopy,
	SimpleDatePicker,
	StatusButton,
	StatusSelect,
} from '@/ui';

import PageInfo from '@/util/PageInfo';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `&own_uuid=${userUUID}`;
	}

	return ``;
};

export default function Index() {
	const [from, setFrom] = useState(new Date());
	const [to, setTo] = useState(new Date());
	const [status, setStatus] = useState('0');
	// * options for extra select in table
	const options = [
		{ value: '0', label: 'Bulk' },
		{ value: '1', label: 'Sample' },
	];

	const haveAccess = useAccess('delivery__warehouse_out');
	const { user } = useAuth();
	const { data, isLoading, url } = useWarehouseNotOutLog(
		format(from, 'yyyy-MM-dd'),
		format(to, 'yyyy-MM-dd'),
		status,
		{
			enabled: true,
		}
	);
	const info = new PageInfo('Warehouse Not Out', url, 'delivery__log');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'packing_number',
				header: 'Packing List',
				width: 'w-36',
				cell: (info) => {
					const { uuid } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={uuid}
							uri='/delivery/packing-list'
						/>
					);
				},
			},

			{
				accessorKey: 'order_number',
				header: 'O/N',
				width: 'w-40',
				cell: (info) => {
					const { order_info_uuid, item_for } = info.row.original;

					if (item_for === 'thread' || item_for === 'sample_thread') {
						return (
							<LinkWithCopy
								title={info.getValue()}
								id={order_info_uuid}
								uri='/thread/order-info'
							/>
						);
					}
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={info.getValue()}
							uri='/order/details'
						/>
					);
				},
			},
			{
				accessorFn: (row) => {
					const { item_description } = row;
					const item =
						item_description
							.map((item) => item.item_description)
							.join(', ') || '';

					if (item.length > 0) return item;
					return '--';
				},
				id: 'item_description',
				header: 'Item Description',
				enableColumnFilter: true,
				cell: ({ row }) => {
					const { order_number, item_description } = row.original;

					let links = [];

					item_description.forEach((item) => {
						links.push({
							label: item.item_description,
							url: `/order/details/${order_number}/${item.order_description_uuid}`,
						});
					});
					return links.map((link, index) => (
						<CustomLink
							key={index}
							label={link.label}
							url={link.url}
							showCopyButton={false}
						/>
					));
				},
			},
			{
				accessorKey: 'item_name',
				header: 'Item',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn(row) {
					if (row.item_for === 'thread') {
						return Math.ceil(
							row.total_quantity / row.cone_per_carton || 1
						);
					} else {
						return 1;
					}
				},
				id: 'carton_quantity',
				header: 'Carton Qty',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'warehouse_received_date',
				header: 'Received Date',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'warehouse_received_by_name',
				header: 'Received By',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'challan_number',
				header: 'Challan',
				width: 'w-36',
				cell: (info) => {
					const { challan_number, challan_uuid } = info.row.original;
					return (
						<LinkWithCopy
							title={challan_number}
							id={challan_uuid}
							uri='/delivery/challan'
						/>
					);
				},
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorFn(row) {
					const { color } = row;
					return color?.join(', ') || '--';
				},
				id: 'color',
				header: 'Colors',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_quantity',
				header: 'Total Qty',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_poly_quantity',
				header: 'Poly',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'carton_size',
				header: 'Carton Size',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'carton_weight',
				header: 'Weight',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'is_sample',
				header: 'Sample',
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton size='btn-sm' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'count',
				header: 'Count',
				enableColumnFilter: false,
				cell: (info) => {
					const { packing_list_wise_rank } = info.row.original;
					const { packing_list_wise_count } = info.row.original;

					return `${packing_list_wise_rank}/${packing_list_wise_count}`;
				},
			},

			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created At',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);
	if (!user?.uuid) return null;
	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<ReactTable
			title={info.getTitle()}
			accessor={false}
			data={data}
			columns={columns}
			extraClass={'py-2'}
			showDateRange={false}
			extraButton={
				<div className='flex items-center gap-2'>
					<SimpleDatePicker
						className='h-[2.34rem] w-32'
						key={'from'}
						value={from}
						placeholder='From'
						onChange={(data) => {
							setFrom(data);
						}}
						selected={from}
					/>
					<SimpleDatePicker
						className='h-[2.34rem] w-32'
						key={'to'}
						value={to}
						placeholder='To'
						onChange={(data) => {
							setTo(data);
						}}
						selected={to}
					/>
					<StatusSelect
						status={status}
						setStatus={setStatus}
						options={options}
					/>
				</div>
			}
		/>
	);
}
