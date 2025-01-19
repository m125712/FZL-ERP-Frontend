import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useThreadProduction } from '@/state/Report';
import { format, startOfMonth, subMonths } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, SimpleDatePicker, StatusButton } from '@/ui';

import PageInfo from '@/util/PageInfo';

import { ProductionStatus } from '../utils';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return `all=true`;
};

export default function Index() {
	const haveAccess = useAccess('report__thread_production');
	const { user } = useAuth();

	const [from, setFrom] = useState(
		format(startOfMonth(subMonths(new Date(), 2)), 'yyyy-MM-dd')
	);
	const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));
	const [status, setStatus] = useState('pending');
	const { data, isLoading, url } = useThreadProduction(
		`status=${status}&from=${from}&to=${to}&${getPath(haveAccess, user?.uuid)}`,
		{
			enabled: !!user?.uuid,
		}
	);
	const info = new PageInfo(
		'Thread Production Status',
		url,
		'report__thread_production'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'batch_number',
				header: 'Batch',
				enableColumnFilter: true,
				cell: (info) => {
					const { uuid } = info.row.original;
					return (
						<CustomLink
							label={info.getValue()}
							url={`/dyeing-and-iron/thread-batch/${uuid}`}
							openInNewTab={true}
						/>
					);
				},
			},
			{
				accessorFn: (row) => format(row.batch_created_at, 'dd/MM/yy'),
				id: 'batch_created_at',
				header: 'Created At',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.batch_created_at}
						isTime={false}
					/>
				),
			},
			{
				accessorKey: 'machine_number',
				header: 'Machine No.',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				cell: (info) => {
					const { order_info_uuid } = info.row.original;
					return (
						<CustomLink
							label={info.getValue()}
							url={`/thread/order-info/${order_info_uuid}`}
							openInNewTab={true}
						/>
					);
				},
			},
			{
				accessorFn: (row) => format(row.order_created_at, 'dd/MM/yy'),
				id: 'order_created_at',
				header: 'Created At',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.order_created_at}
						isTime={false}
					/>
				),
			},
			{
				accessorFn: (row) =>
					row.order_updated_at
						? format(row.order_updated_at, 'dd/MM/yy')
						: '--',
				id: 'order_updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.order_updated_at}
						isTime={false}
					/>
				),
			},
			{
				accessorKey: 'marketing_name',
				header: 'S&M',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'style',
				header: 'Style',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'color',
				header: 'Color',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'recipe_name',
				header: 'Shade',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					format(row.swatch_approval_date, 'dd/MM/yy'),
				id: 'swatch_approval_date',
				header: 'Swatch',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.swatch_approval_date}
						isTime={false}
					/>
				),
			},
			{
				accessorKey: 'count',
				header: 'Count',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'length',
				header: 'Length',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_quantity',
				header: 'Batch QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_weight',
				header: 'Expected',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'yarn_quantity',
				header: 'Issued',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'is_drying_complete',
				header: 'Drying',
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton size='btn-xs' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'total_coning_production_quantity',
				header: 'Coning',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_packing_list_quantity',
				header: 'Packing List',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.total_delivery_delivered_quantity +
					row.total_delivery_balance_quantity,
				id: 'total_delivery_balance_quantity',
				header: 'Challan',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_short_quantity',
				header: 'Short',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_reject_quantity',
				header: 'Reject',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_delivery_delivered_quantity',
				header: 'Delivered',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
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
		<>
			<ReactTable
				title={info.getTitle()}
				accessor={false}
				data={data}
				columns={columns}
				extraClass={'py-0.5'}
				extraButton={
					<div className='flex items-center gap-2'>
						<SimpleDatePicker
							className='h-[2.34rem] w-32'
							key={'from'}
							value={from}
							placeholder='From'
							onChange={(data) => {
								setFrom(format(data, 'yyyy-MM-dd'));
							}}
						/>
						<SimpleDatePicker
							className='h-[2.34rem] w-32'
							key={'to'}
							value={to}
							placeholder='To'
							onChange={(data) => {
								setTo(format(data, 'yyyy-MM-dd'));
							}}
						/>
						<ProductionStatus
							className='w-44'
							status={status}
							setStatus={setStatus}
							page='report__thread_production'
						/>
					</div>
				}
			/>
		</>
	);
}
