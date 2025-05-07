import { useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useThreadProductionBatchWise } from '@/state/Report';
import { format, parse, startOfMonth, subMonths } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, SimpleDatePicker, StatusButton } from '@/ui';

import { ProductionStatus, REPORT_DATE_FORMATE } from '../utils';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `&own_uuid=${userUUID}`;
	}

	return ``;
};

export default function Index() {
	const haveAccess = useAccess('report__thread_production_batch_wise');
	const { user } = useAuth();

	// const [from, setFrom] = useState(
	// 	parse(
	// 		format(
	// 			startOfMonth(subMonths(new Date(), 2)),
	// 			'yyyy-MM-dd hh:mm:ss'
	// 		),
	// 		'yyyy-MM-dd HH:mm:ss',
	// 		new Date()
	// 	)
	// );
	const [from, setFrom] = useState(new Date());
	const [to, setTo] = useState(new Date());
	const [status, setStatus] = useState('pending');
	const { data, isLoading } = useThreadProductionBatchWise(
		`status=${status}&time_from=${format(from, 'yyyy-MM-dd hh:mm:ss')}&time_to=${format(to, 'yyyy-MM-dd hh:mm:ss')}${getPath(haveAccess, user?.uuid)}`,
		{
			enabled: !!user?.uuid,
		}
	);

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
				accessorFn: (row) => REPORT_DATE_FORMATE(row.batch_created_at),
				id: 'batch_created_at',
				header: 'Created At',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.batch_created_at}
						isTime={true}
					/>
				),
			},
			{
				accessorKey: 'machine_name',
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
				accessorFn: (row) => REPORT_DATE_FORMATE(row.order_created_at),
				id: 'order_created_at',
				header: 'Created At',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.order_created_at}
						isTime={true}
					/>
				),
			},
			{
				accessorFn: (row) =>
					row.order_updated_at
						? REPORT_DATE_FORMATE(row.order_updated_at)
						: '--',
				id: 'order_updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.order_updated_at}
						isTime={true}
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
					REPORT_DATE_FORMATE(row.swatch_approval_date),
				id: 'swatch_approval_date',
				header: 'Swatch',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.swatch_approval_date}
						isTime={true}
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
				title={'Thread Production Status (Batch wise)'}
				accessor={false}
				data={data}
				columns={columns}
				extraClass={'py-0.5'}
				extraButton={
					<div className='flex items-center gap-2'>
						<SimpleDatePicker
							className='m-w-32 h-[2.34rem]'
							key={'from'}
							value={from}
							placeholder='From'
							selected={from}
							onChangeForTime={(data) => {
								setFrom(data);
							}}
							showTime={true}
						/>
						<SimpleDatePicker
							className='m-w-32 h-[2.34rem]'
							key={'to'}
							value={to}
							placeholder='To'
							selected={to}
							onChangeForTime={(data) => {
								setTo(data);
							}}
							showTime={true}
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
