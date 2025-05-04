import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useThreadBatch } from '@/state/Report';
import { format, parse, subDays } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import BatchType from '@/ui/Others/BatchType';
import { DateTime, LinkWithCopy, SimpleDatePicker, StatusButton } from '@/ui';

import { cn } from '@/lib/utils';
import PageInfo from '@/util/PageInfo';

export default function Index() {
	const [from, setFrom] = useState(
		parse(
			format(
				subDays(new Date(), 1), // Subtract 1 week from current time
				'yyyy-MM-dd HH:mm:ss'
			),
			'yyyy-MM-dd HH:mm:ss',
			new Date()
		)
	);
	const [to, setTo] = useState(new Date());
	const { data, url, isLoading } = useThreadBatch(
		`from=${format(from, 'yyyy-MM-dd HH:mm:ss')}&to=${format(to, 'yyyy-MM-dd HH:mm:ss')}`
	);

	const info = new PageInfo('Thread Batch', url, 'report__thread_batch');
	const { user } = useAuth();
	const haveAccess = useAccess('report__thread_batch');

	const [status, setStatus] = useState([]);

	useEffect(() => {
		if (data) {
			setStatus(data.map((item) => item.is_drying_complete === 'true'));
		}
	}, [data]);

	const columns = useMemo(
		() => [
			// * batch_id
			{
				accessorKey: 'batch_id',
				header: 'Batch ID',
				enableColumnFilter: true,
				cell: (info) => (
					<LinkWithCopy
						title={info.getValue()}
						id={info.row.original.uuid}
						uri='/dyeing-and-iron/thread-batch'
					/>
				),
			},
			{
				accessorFn: (row) => {
					const { order_numbers } = row;
					let concat = '';
					if (order_numbers) {
						concat = order_numbers
							.map((order_number) => order_number.order_number)
							.join(', ');
					}

					return concat;
				},
				id: 'order_numbers',
				header: 'O/N',
				width: 'w-40',
				enableColumnFilter: true,
				cell: (info) => {
					const { order_numbers } = info.row.original;

					return order_numbers?.map((order_number) => {
						return (
							<LinkWithCopy
								key={order_number}
								title={order_number.order_number}
								id={order_number.order_info_uuid}
								uri='/thread/order-info'
							/>
						);
					});
				},
			},
			{
				accessorKey: 'batch_type',
				header: 'Type',
				enableColumnFilter: false,
				cell: (info) => <BatchType value={info.getValue()} />,
			},
			{
				accessorKey: 'production_date',
				header: (
					<div className='flex flex-col'>
						<span>Production </span>
						<span>Date</span>
					</div>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime date={info.getValue()} isTime={false} />
				),
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => row.color.join(', '),
				id: 'color',
				header: 'Color',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => row.recipe_name.join(', '),
				id: 'recipe_name',
				header: 'Shade',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_cone',
				header: (
					<div className='flex flex-col'>
						<span>Total Qty</span>
						<span>(Cone)</span>
					</div>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_expected_weight',
				header: (
					<div className='flex flex-col'>
						<span>Exp Yarn</span>
						<span>Qty (KG)</span>
					</div>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_yarn_quantity',
				header: (
					<div className='flex flex-col'>
						<span>Actual Yarn</span>
						<span>Qty (KG)</span>
					</div>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'status',
				header: 'Status',
				enableColumnFilter: false,
				cell: (info) => {
					const res = {
						cancelled: 'badge-error',
						completed: 'badge-success',
						pending: 'badge-warning',
					};
					return (
						<span
							className={cn(
								'badge badge-sm uppercase',
								res[info.getValue()]
							)}
						>
							{info.getValue()}
						</span>
					);
				},
			},
			{
				accessorKey: 'is_drying_complete',
				header: (
					<div className='flex flex-col'>
						<span>Drying</span>
						<span>Completed</span>
					</div>
				),
				enableColumnFilter: false,
				cell: (info) => {
					const { is_drying_complete } = info.row.original;

					const access = haveAccess.includes('click_drying_status');
					const overrideAccess = haveAccess.includes(
						'click_drying_status_override'
					);
					let isDisabled = false;
					if (!overrideAccess) {
						if (access) {
							isDisabled = is_drying_complete === 'true';
						} else {
							isDisabled = true;
						}
					}
					return (
						<StatusButton size='btn-xs' value={info.getValue()} />
					);
				},
			},
			{
				accessorKey: 'drying_created_at',
				header: 'Drying Created',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'machine_name',
				header: 'Machine',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'slot',
				header: 'Slot',
				enableColumnFilter: false,
				cell: (info) => {
					const value = info.getValue();
					if (value === 0) {
						return '-';
					} else {
						return 'Slot ' + value;
					}
				},
			},

			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			// * created_at
			{
				accessorKey: 'created_at',
				header: 'Created at',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			// * updated_at
			{
				accessorKey: 'updated_at',
				header: 'Updated at',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			// * remarks
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[data, status]
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				data={data}
				columns={columns}
				showDateRange={false}
				accessor={haveAccess.includes('create')}
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
					</div>
				}
			/>
		</div>
	);
}
