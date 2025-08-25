import { useEffect, useMemo, useState } from 'react';
import { useZipperBatch } from '@/state/Report';
import { format, parse, subDays } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import BatchType from '@/ui/Others/BatchType';
import {
	CustomLink,
	DateTime,
	SimpleDatePicker,
	StatusButton,
	StatusSelect,
} from '@/ui';

import { cn } from '@/lib/utils';
import PageInfo from '@/util/PageInfo';

const orderTypeOptions = [
	{ value: 'all', label: 'All' },
	{ value: 'bulk', label: 'Bulk' },
	{ value: 'sample', label: 'Sample' },
];

const filterTypeOptions = [
	{ value: 'dyeing_status_date', label: 'Dyeing Status' },
	{ value: 'received_date', label: 'Stock Received' },
];

export default function Index() {
	const [orderType, setOrderType] = useState('bulk');
	const [filterType, setFilterType] = useState('dyeing_status_date');
	const [from, setFrom] = useState(() =>
		parse(
			format(
				subDays(new Date(), 1), // Subtract 1 week from current time
				'yyyy-MM-dd HH:mm:ss'
			),
			'yyyy-MM-dd HH:mm:ss',
			new Date()
		)
	);
	const [to, setTo] = useState(() => new Date());
	const { data, url, isLoading } = useZipperBatch(
		`from=${format(from, 'yyyy-MM-dd HH:mm:ss')}&to=${format(to, 'yyyy-MM-dd HH:mm:ss')}&order_type=${orderType}&filter_type=${filterType}`
	);

	const info = new PageInfo(
		'Zipper Dyeing Batch',
		url,
		'report__zipper_dyeing_batch'
	);

	const haveAccess = useAccess('report__zipper_dyeing_batch');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'batch_id',
				header: 'Batch ID',
				// enableColumnFilter: false,
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						id={info.row.original.uuid}
						url={`/dyeing-and-iron/zipper-batch/${info.row.original.uuid}`}
					/>
				),
			},
			{
				accessorFn: (row) => {
					return row.order_numbers
						?.map((order_number) => order_number)
						?.join(' -- ');
				},
				id: 'order_numbers',
				header: 'O/N',
				width: 'w-28',
				// enableColumnFilter: false,
				cell: (info) => {
					return info?.row?.original?.order_numbers?.map(
						(order_number) => {
							return (
								<CustomLink
									key={order_number}
									label={order_number}
									url={`/order/details/${order_number}`}
								/>
							);
						}
					);
				},
			},
			{
				accessorFn: (row) => {
					return row.item_descriptions
						?.map((item) => item.item_description)
						.join(' -- ');
				},
				id: 'item_descriptions',
				header: 'Item Description',
				// enableColumnFilter: true,
				width: 'w-44',
				cell: (info) => {
					return info?.row?.original?.item_descriptions?.map(
						(item) => {
							return (
								<CustomLink
									key={
										item.order_description_uuid +
										'-' +
										item.order_number
									}
									label={item.item_description}
									url={`/order/details/${item.order_number}/${item.order_description_uuid}`}
									openInNewTab={true}
								/>
							);
						}
					);
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
					<>
						Production <br />
						Date
					</>
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
				accessorFn: (row) =>
					row.style?.map((style) => style)?.join(' -- '),
				id: 'style',
				header: 'Style',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.color?.map((color) => color)?.join(' -- '),
				id: 'color',
				header: 'Color',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'bulk_approval_date',
				header: () => (
					<>
						Bulk <br />
						App.
					</>
				),
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => (
					<div className='flex flex-col gap-2'>
						<StatusButton
							size='btn-sm'
							value={info.getValue() ? true : false}
						/>

						{info.getValue() && (
							<DateTime date={info.getValue()} isTime={false} />
						)}
					</div>
				),
			},
			{
				accessorKey: 'total_quantity',
				header: (
					<>
						Total Qty <br />
						(Pcs)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'expected_kg',
				header: (
					<span>
						Exp Prod <br />
						Qty (kg)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_actual_production_quantity',
				header: (
					<span>
						Total Prod <br />
						Qty (kg)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'batch_status',
				header: 'Dyeing Status',
				enableColumnFilter: false,
				cell: (info) => {
					const res = {
						cancelled: 'badge-error',
						running: 'badge-info',
						completed: 'badge-success',
						pending: 'badge-warning',
					};
					return (
						<div className='flex flex-col gap-1'>
							<span
								className={cn(
									'badge badge-sm uppercase',
									res[info.getValue()]
								)}
							>
								{info.getValue()}
							</span>
							<DateTime
								date={info.row.original.batch_status_date}
								isTime={false}
							/>
						</div>
					);
				},
			},
			{
				accessorKey: 'received',
				header: 'Stock Received',
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<div className='flex gap-2'>
							<StatusButton
								size='btn-xs'
								value={info.getValue()}
							/>
							<DateTime
								date={info.row.original.received_date}
								isTime={false}
							/>
						</div>
					);
				},
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
					}
					return 'Slot ' + value;
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
				width: 'w-24',
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
				width: 'w-24',
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
		[data]
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
						<StatusSelect
							options={filterTypeOptions}
							status={filterType}
							setStatus={setFilterType}
						/>
						<StatusSelect
							options={orderTypeOptions}
							status={orderType}
							setStatus={setOrderType}
						/>
					</div>
				}
			/>
		</div>
	);
}
