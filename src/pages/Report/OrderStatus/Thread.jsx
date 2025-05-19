import { useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useThreadStatus } from '@/state/Report';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, SimpleDatePicker, Status } from '@/ui';

import { cn } from '@/lib/utils';

import { REPORT_DATE_FORMATE } from '../utils';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return `all=true`;
};

export default function Index() {
	const haveAccess = useAccess('report__order_status');
	const { user } = useAuth();

	const [date, setDate] = useState(new Date());
	const [toDate, setToDate] = useState(new Date());

	const { data, isLoading, url } = useThreadStatus(
		format(date, 'yyyy-MM-dd'),
		format(toDate, 'yyyy-MM-dd'),
		getPath(haveAccess, user?.uuid),
		{
			enabled: !!user?.uuid,
		}
	);

	let rowStyle = 'border border-gray-300 px-2 py-1';
	const columns = useMemo(
		() => [
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
							openInNewTab={true}
						/>
					);
				},
			},
			{
				accessorFn: (row) => {
					const piArr = Array.isArray(row?.pi_numbers)
						? row.pi_numbers
						: [];
					if (piArr.length === 0) return '--';
					return piArr.map((pi) => pi.pi_number).join(', ');
				},
				id: 'pi_numbers',
				header: <>Pi No.</>,
				enableColumnFilter: false,
				cell: (info) => {
					const piArr = Array.isArray(info.row.original.pi_numbers)
						? info.row.original.pi_numbers
						: [];
					if (piArr.length === 0) return '--';
					return piArr.map((pi) => (
						<CustomLink
							key={pi.pi_number}
							label={pi.pi_number}
							url={`/commercial/pi/${pi.pi_number}`}
							openInNewTab
						/>
					));
				},
			},
			{
				accessorFn: (row) => {
					const lcArr = Array.isArray(row?.lc_numbers)
						? row.lc_numbers
						: [];
					if (lcArr.length === 0) return '--';
					return lcArr.map((pi) => pi.pi_number).join(', ');
				},
				id: 'lc_numbers',
				header: <>LC No.</>,
				enableColumnFilter: false,
				cell: (info) => {
					const lcArr = Array.isArray(info.row.original.lc_numbers)
						? info.row.original.lc_numbers
						: [];
					if (lcArr.length === 0) return '--';
					return lcArr.map((pi) => (
						<CustomLink
							key={pi.pi_number}
							label={pi.pi_number}
							url={`/commercial/pi/${pi.pi_number}`}
							openInNewTab
						/>
					));
				},
			},
			{
				accessorKey: 'marketing_name',
				header: 'Marketing',
				enableColumnFilter: false,
				width: 'w-32',
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
				accessorKey: 'style',
				header: 'Style',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'color',
				header: 'Color',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.swatch_approval_date &&
					REPORT_DATE_FORMATE(row.swatch_approval_date),
				id: 'swatch_approval_date',
				header: 'Swatch App. Date',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.swatch_approval_date}
						isTime={false}
						customizedDateFormate='dd MMM,yyyy'
					/>
				),
			},
			{
				accessorKey: 'count_length_name',
				header: 'Count Length',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'quantity',
				header: 'QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'recipe_name',
				header: 'Recipe',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_expected_weight',
				header: 'Exp. Yarn Wgt',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => row.batch_number,
				id: 'batch_number',
				header: 'BA/N',
				enableColumnFilter: false,
				cell: (info) => {
					const { batch_uuid, batch_number } = info.row.original;
					return (
						<CustomLink
							label={batch_number}
							url={`/dyeing-and-iron/thread-batch/${batch_uuid}`}
							openInNewTab={true}
							showCopyButton={false}
						/>
					);
				},
			},
			{
				accessorFn: (row) =>
					row.production_date &&
					REPORT_DATE_FORMATE(row.production_date),
				id: 'production_date',
				header: 'P/D',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.production_date}
						isTime={false}
						customizedDateFormate='dd MMM,yyyy'
					/>
				),
			},
			{
				accessorKey: 'total_quantity',
				header: 'Qty',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'yarn_issued',
				header: 'Yarn',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'is_drying_complete',
				header: 'D/C',
				enableColumnFilter: false,
				cell: (info) => <Status status={info.getValue()} />,
			},
			{
				accessorKey: 'machine',
				header: 'D/M',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorFn: (row) => {
			// 		return row.batch
			// 			?.map((item) => item.batch_number)
			// 			.join(', ');
			// 	},
			// 	id: 'batches',
			// 	header: 'Batch',
			// 	enableColumnFilter: false,
			// 	cell: ({ row }) => {
			// 		const { batches } = row.original;

			// 		if (!batches?.length) return '--';

			// 		return (
			// 			<table className='border-2 border-gray-300'>
			// 				<thead>
			// 					<tr className='text-xs text-gray-600'>
			// 						<th className={cn(rowStyle)}>BA/N</th>
			// 						<th className={cn(rowStyle)}>Qty</th>
			// 						<th className={cn(rowStyle)}>Yarn</th>
			// 						<th className={cn(rowStyle)}>D/C</th>
			// 						<th className={cn(rowStyle)}>M</th>
			// 					</tr>
			// 				</thead>
			// 				<tbody>
			// 					{batches?.map((item) => (
			// 						<tr>
			// 							<td className={cn(rowStyle)}>
			// 								<CustomLink
			// 									label={item.batch_number}
			// 									url={`/dyeing-and-iron/thread-batch/${item.batch_uuid}`}
			// 									openInNewTab={true}
			// 									showCopyButton={false}
			// 								/>
			// 								<DateTime
			// 									date={item.production_date}
			// 									customizedDateFormate='dd MMM, yy'
			// 									isTime={false}
			// 								/>
			// 							</td>
			// 							<td className={cn(rowStyle)}>
			// 								{item.total_quantity}
			// 							</td>
			// 							<td className={cn(rowStyle)}>
			// 								{item.yarn_issued}
			// 							</td>
			// 							<td className={cn(rowStyle)}>
			// 								<Status
			// 									status={item.is_drying_complete}
			// 								/>
			// 							</td>{' '}
			// 							<td className={cn(rowStyle)}>
			// 								{item.machine}
			// 							</td>
			// 						</tr>
			// 					))}
			// 				</tbody>
			// 			</table>
			// 		);
			// 	},
			// },
			{
				accessorKey: 'not_approved_quantity',
				header: 'Not App. QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'approved_quantity',
				header: 'App. QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_yarn_quantity',
				header: 'Dyeing QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue() + ' kg',
			},
			{
				accessorKey: 'total_coning_production_quantity',
				header: 'Coning QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'delivered',
				header: 'Delivered QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'balance_quantity',
				header: 'Balance QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_price',
				header: 'Party Price',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('show_price'),
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'company_price',
				header: 'Company Price',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('show_price'),
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.created_at && REPORT_DATE_FORMATE(row.created_at),
				id: 'created_at',
				header: 'Created',
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
				accessorFn: (row) =>
					row.updated_at && REPORT_DATE_FORMATE(row.updated_at),
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
		],
		[data]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<ReactTable
			key='Thread Status'
			showDateRange={false}
			title={'Thread Status'}
			subtitle={
				<div className='flex flex-col'>
					<span>
						delivered = when the packing list is warehouse out
					</span>
					<span>balance = order qty - delivered</span>
				</div>
			}
			accessor={false}
			data={data}
			columns={columns}
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
				</div>
			}
		/>
	);
}
