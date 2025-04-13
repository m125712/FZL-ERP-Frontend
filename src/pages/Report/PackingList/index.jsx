import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { usePackingList } from '@/state/Report';
import { format, startOfMonth, subMonths } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import {
	CustomLink,
	DateTime,
	SimpleDatePicker,
	StatusButton,
	StatusSelect,
} from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function Index() {
	const haveAccess = useAccess('report__packing_list');
	const [status, setStatus] = useState('pending');
	const options = [
		{ value: 'all', label: 'All' },
		{ value: 'pending', label: 'Pending' },
		{ value: 'challan', label: 'Challan' },
		{ value: 'gate_pass', label: 'W/H Out' },
	];

	const { data, isLoading, url } = usePackingList(`type=${status}`);
	const info = new PageInfo('PackingList', url, 'report__packing_list');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorFn: (row) => format(row.created_at, 'dd MMM,yyyy'),
				id: 'created_at',
				header: (
					<>
						Packing <br /> List Date
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.getValue()}
						isTime={false}
						customizedDateFormate='dd MMM,yyyy'
					/>
				),
			},
			{
				accessorKey: 'packing_number',
				header: 'Packing List',
				enableColumnFilter: true,
				width: 'w-24',
				cell: (info) => {
					return (
						<CustomLink
							label={info.getValue()}
							url={`/delivery/packing-list/${info.row.original.uuid}`}
							openInNewTab={false}
						/>
					);
				},
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				width: 'w-40',
				cell: (info) => {
					const order_uuid = info.row.original.order_info_uuid;
					const link = info.getValue().includes('ST')
						? `/thread/order-info/${order_uuid}`
						: `/order/details/${info.getValue()}`;
					return (
						<CustomLink
							label={info.getValue()}
							url={link}
							openInNewTab={false}
						/>
					);
				},
			},
			{
				accessorFn: (row) =>
					row.challan_created_at
						? format(row.challan_created_at, 'dd MMM,yyyy')
						: '',
				id: 'challan_created_at',
				header: (
					<>
						Challan <br /> Date
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.getValue()}
						isTime={false}
						customizedDateFormate='dd MMM,yyyy'
					/>
				),
			},
			{
				accessorKey: 'challan_number',
				header: 'Challan',
				width: 'w-36',
				enableColumnFilter: true,
				cell: (info) => {
					const { challan_number, challan_uuid } = info.row.original;
					return (
						<CustomLink
							label={challan_number}
							id={challan_uuid}
							url={`/delivery/challan/${challan_uuid}`}
						/>
					);
				},
			},
			{
				accessorFn: (row) => (row.is_warehouse_received ? 'Y' : 'N'),
				id: 'is_warehouse_received',
				header: 'Received',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => (
					<StatusButton
						size='btn-xs'
						value={info.row.original.is_warehouse_received}
					/>
				),
			},
			{
				accessorFn: (row) => (row.gate_pass ? 'Y' : 'N'),
				id: 'gate_pass',
				header: 'Warehouse Out',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => (
					<StatusButton
						size='btn-xs'
						value={info.row.original.gate_pass}
					/>
				),
			},
			{
				accessorKey: 'color',
				header: 'Color',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue().join(', '),
			},
			{
				accessorKey: 'style',
				header: 'Style',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue().join(', '),
			},
			{
				accessorKey: 'unit',
				header: 'Unit',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => row.pi_numbers?.join(', '),
				id: 'pi_numbers',
				header: <>Pi No.</>,
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'marketing_name',
				header: 'Marketing',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'buyer_name',
				header: 'Buyer',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => row.item_description?.join(', '),
				id: 'item_description',
				header: <>Item Description</>,
				enableColumnFilter: false,
				width: 'w-64',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_quantity',
				header: 'Total Qty.',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_poly_quantity',
				header: 'Poly Qty.',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'company_price',
				header: 'Company Price',
				enableColumnFilter: false,
				width: 'w-32',
				hidden: !haveAccess.includes('show_price'),
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_price',
				header: 'Party Price',
				enableColumnFilter: false,
				width: 'w-32',
				hidden: !haveAccess.includes('show_price'),
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_amount_without_commission',
				header: (
					<>
						Total w/o <br /> com.
					</>
				),
				enableColumnFilter: false,

				hidden: !haveAccess.includes('show_price'),
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_amount_with_commission',
				header: (
					<>
						Total with
						<br /> com.
					</>
				),
				enableColumnFilter: false,

				hidden: !haveAccess.includes('show_price'),
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'challan_total_amount_without_commission',
				header: (
					<>
						Challan Total <br /> w/o com.
					</>
				),
				enableColumnFilter: false,

				hidden: !haveAccess.includes('show_price'),
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'challan_total_amount_with_commission',
				header: (
					<>
						Challan Total <br /> with com.
					</>
				),
				enableColumnFilter: false,

				hidden: !haveAccess.includes('show_price'),
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
				header: 'Carton Weight',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					`${row.packing_list_wise_rank}/${row.packing_list_wise_count}`,
				id: 'count',
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
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.updated_at && format(row.updated_at, 'dd MMM,yyyy'),
				id: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.getValue()}
						isTime={false}
						customizedDateFormate='dd MMM,yyyy'
					/>
				),
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

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<ReactTable
			key='bulk'
			title={info.getTitle()}
			accessor={false}
			data={data}
			columns={columns}
			extraClass={'py-0.5'}
			extraButton={
				<StatusSelect
					options={options}
					status={status}
					setStatus={setStatus}
				/>
			}
		/>
	);
}
