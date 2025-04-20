import { useEffect, useMemo, useState } from 'react';
import { usePackingList } from '@/state/Report';
import { format } from 'date-fns';
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

const options = [
	{ value: 'all', label: 'All' },
	{ value: 'pending', label: 'Pending' },
	{ value: 'challan', label: 'Challan' },
	{ value: 'gate_pass', label: 'W/H Out' },
];

export default function Index() {
	const haveAccess = useAccess('report__packing_list');
	const [status, setStatus] = useState('pending');
	const [date, setDate] = useState(new Date());
	const [toDate, setToDate] = useState(new Date());

	const { data, isLoading, url } = usePackingList(
		`type=${status}&from_date=${format(date, 'yyyy-MM-dd')}&to_date=${format(toDate, 'yyyy-MM-dd')}`
	);
	const info = new PageInfo('PackingList', url, 'report__packing_list');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorFn: (row) => format(row.created_at, 'dd/MM/yy'),
				id: 'created_at',
				header: (
					<>
						Packing <br />
						List Date
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.created_at}
						isTime={false}
						customizedDateFormate='dd MMM,yyyy'
					/>
				),
			},
			{
				accessorKey: 'packing_number',
				header: 'Packing List',
				enableColumnFilter: true,
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						url={`/delivery/packing-list/${info.row.original.uuid}`}
						openInNewTab={false}
					/>
				),
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
				accessorFn: (row) => (row.is_warehouse_received ? 'Y' : 'N'),
				id: 'is_warehouse_received',
				header: 'Recv.',
				enableColumnFilter: false,
				cell: (info) => {
					const { warehouse_received_date, is_warehouse_received } =
						info.row.original;
					return (
						<div className='flex items-center gap-1'>
							<StatusButton
								size='btn-xs'
								value={is_warehouse_received}
							/>
							<DateTime date={warehouse_received_date} />
						</div>
					);
				},
			},
			{
				accessorKey: 'challan_number',
				header: 'Challan',
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
				accessorFn: (row) =>
					row.challan_created_at
						? format(row.challan_created_at, 'dd/MM/yy')
						: '',
				id: 'challan_created_at',
				header: (
					<>
						Challan <br />
						Date
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.challan_created_at}
						isTime={false}
						customizedDateFormate='dd MMM,yyyy'
					/>
				),
			},
			{
				accessorFn: (row) => (row.gate_pass ? 'Y' : 'N'),
				id: 'gate_pass',
				header: 'W/O',
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton
						size='btn-xs'
						value={info.row.original.gate_pass}
					/>
				),
				cell: (info) => {
					const { gate_pass_date, gate_pass } = info.row.original;
					return (
						<div className='flex items-center gap-1'>
							<StatusButton size='btn-xs' value={gate_pass} />
							<DateTime date={gate_pass_date} />
						</div>
					);
				},
			},
			{
				accessorFn: (row) => {
					const uniqueItemDescription = new Set(
						row.item_description?.map((item) => item)
					);

					return [...uniqueItemDescription].join(', ');
				},
				id: 'item_description',
				header: <>Item Description</>,
				enableColumnFilter: false,
				width: 'w-64',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'style',
				header: 'Style',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue().join(', '),
			},
			{
				accessorKey: 'color',
				header: 'Color',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue().join(', '),
			},
			{
				accessorKey: 'unit',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				// {
				//     "pi_numbers": "PI25-0125",
				//     "pi_cash_uuid": "HaUGbBIALoZjzIw"
				// },
				accessorFn: (row) => {
					if (row?.pi_numbers == null) return '--';

					const pis = row.pi_numbers?.map((pi) => pi.pi_numbers);
					return pis.join(', ');
				},
				id: 'pi_numbers',
				header: <>Pi No.</>,
				enableColumnFilter: false,
				cell: (info) => {
					if (info.getValue() === '--') return '--';

					const { pi_numbers } = info.row.original;
					return pi_numbers?.map((pi) => {
						return (
							<CustomLink
								key={pi.pi_numbers}
								label={pi.pi_numbers}
								url={`/commercial/pi/${pi.pi_numbers}`}
								openInNewTab
							/>
						);
					});
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
				accessorKey: 'total_quantity',
				header: 'Total QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_poly_quantity',
				header: 'Poly QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'company_price',
				header: '',
				header: (
					<>
						Com. Price ($) <br />
						Per DZN
					</>
				),
				enableColumnFilter: false,
				hidden: !haveAccess.includes('show_price'),
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_price',
				header: (
					<>
						Party Price ($) <br />
						Per DZN
					</>
				),
				enableColumnFilter: false,
				hidden: !haveAccess.includes('show_price'),
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_amount_without_commission',
				header: (
					<>
						Total Price ($) <br />
						Without com.
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
						Total Price ($) <br />
						with com.
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
						Challan Total Price ($) <br />
						w/o com.
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
						Challan Total Price ($) <br />
						with com.
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
					row.updated_at && format(row.updated_at, 'dd/MM/yy'),
				id: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.updated_at}
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
			showDateRange={false}
			extraClass={'py-0.5'}
			extraButton={
				<div className='flex items-center gap-2'>
					<SimpleDatePicker
						className='h-[2.34rem] w-32'
						key={'Date'}
						value={date}
						placeholder='Date'
						onChange={(data) => {
							setDate(data);
						}}
						selected={date}
					/>
					<SimpleDatePicker
						className='h-[2.34rem] w-32'
						key={'toDate'}
						value={toDate}
						placeholder='To'
						onChange={(data) => {
							setToDate(data);
						}}
						selected={toDate}
					/>
					<StatusSelect
						options={options}
						status={status}
						setStatus={setStatus}
					/>
				</div>
			}
		/>
	);
}
