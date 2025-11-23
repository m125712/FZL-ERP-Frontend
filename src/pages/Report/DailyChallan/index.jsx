import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useDailyChallan } from '@/state/Report';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, StatusButton, StatusSelect } from '@/ui';

import PageInfo from '@/util/PageInfo';

import { REPORT_DATE_FORMATE } from '../utils';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID)
		return `own_uuid=${userUUID}`;

	return `all=true`;
};

export default function Index() {
	const haveAccess = useAccess('report__daily_challan');
	const { user } = useAuth();

	// const [date, setDate] = useState(new Date());
	// const [toDate, setToDate] = useState(new Date());
	const [type, setType] = useState('pending');

	const options = [
		{ value: 'pending', label: 'Pending' },
		{ value: 'gate_pass', label: 'Gate Pass' },
		{ value: 'delivered', label: 'Delivered' },
		{ value: 'received', label: 'Received' },
		{ value: 'all', label: 'All' },
	];

	const { data, isLoading, url } = useDailyChallan(
		// format(date, 'yyyy-MM-dd'),
		// format(toDate, 'yyyy-MM-dd'),
		type,
		getPath(haveAccess, user?.uuid),
		{ enabled: !!user?.uuid }
	);
	const info = new PageInfo('Daily Challan', url, 'report__daily_challan');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorFn: (row) => REPORT_DATE_FORMATE(row.challan_date),
				id: 'challan_date',
				header: 'Challan Date',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.challan_date}
						isTime={false}
						customizedDateFormate='dd MMM, yy'
					/>
				),
			},
			{
				accessorKey: 'challan_id',
				header: 'Challan No.',
				enableColumnFilter: true,
				width: 'w-40',
				cell: (info) => {
					const { uuid } = info.row.original;
					return (
						<CustomLink
							label={info.getValue()}
							url={`/delivery/challan/${uuid}`}
							openInNewTab={true}
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
					const { product, order_info_uuid } = info.row.original;
					return (
						<CustomLink
							label={info.getValue()}
							url={
								product === 'thread'
									? `/thread/order-info/${order_info_uuid}`
									: `/order/details/${info.getValue()}`
							}
							openInNewTab={true}
						/>
					);
				},
			},
			{
				accessorKey: 'product',
				header: 'Product',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => (row.gate_pass ? 'YES' : 'NO'),
				id: 'gate_pass',
				header: (
					<>
						W/H <br />
						Out
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton
						size='btn-xs'
						value={info.row.original.gate_pass}
					/>
				),
			},
			{
				accessorKey: 'total_quantity',
				header: (
					<>
						Total <br />
						QTY
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'is_delivered',
				header: 'Delivered',
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton size='btn-xs' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'is_delivered_by_name',
				header: 'Delivered By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'is_delivered_date',
				header: (
					<>
						Delivered <br /> Date
					</>
				),
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'receive_status',
				header: 'Received',
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton size='btn-xs' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'receive_status_by_name',
				header: 'Received By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'receive_status_date',
				header: (
					<>
						Received <br /> Date
					</>
				),
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'created_by_name',
				header: 'Prepared By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorFn: (row) => {
					const { lc_numbers } = row;
					if (lc_numbers === null) return '--';

					return lc_numbers?.map((lc) => lc?.lc_number).join(', ');
				},
				id: 'lc_numbers',
				header: 'LC No.',
				enableColumnFilter: false,
				cell: (info) => {
					const { lc_numbers } = info.row.original;

					if (lc_numbers === null) return '--';

					return lc_numbers?.map((lc) => (
						<CustomLink
							key={lc?.lc_number}
							label={lc?.lc_number}
							url={`/commercial/lc/details/${lc?.lc_uuid}`}
							openInNewTab
						/>
					));
				},
			},
			{
				accessorFn: (row) => {
					const { pi_numbers } = row;
					if (pi_numbers === null) return '--';

					return pi_numbers?.map((pi) => pi?.pi_number).join(', ');
				},
				id: 'pi_numbers',
				header: 'Pi No.',
				enableColumnFilter: false,
				cell: (info) => {
					const { pi_numbers } = info.row.original;
					if (pi_numbers === null) return '--';

					return pi_numbers?.map((pi) => (
						<CustomLink
							key={pi?.pi_number}
							label={pi?.pi_number}
							url={`/commercial/pi/${pi?.pi_number}`}
							openInNewTab
						/>
					));
				},
			},
			{
				accessorKey: 'marketing_name',
				header: 'S&M',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'factory_name',
				header: 'Factory',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'buyer_name',
				header: 'Buyer',
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
			extraButton={
				<div className='flex items-center gap-2'>
					{/* <SimpleDatePicker
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
					/> */}
					<StatusSelect
						options={options}
						status={type}
						setStatus={setType}
					/>
				</div>
			}
		/>
	);
}
