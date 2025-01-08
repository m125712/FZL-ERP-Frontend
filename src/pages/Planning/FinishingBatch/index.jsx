import { useEffect, useMemo } from 'react';
import { useDyeingFinishingBatch } from '@/state/Dyeing';
import { differenceInDays, format, subDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { DateTime, EditDelete, LinkOnly, LinkWithCopy } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function index() {
	const navigate = useNavigate();
	const haveAccess = useAccess('planning__finishing_batch');

	const { data, isLoading, url } = useDyeingFinishingBatch();

	const info = new PageInfo('Batch', url, 'planning__finishing_batch');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'batch_number',
				header: 'Batch',
				enableColumnFilter: false,
				cell: (info) => {
					const { uuid } = info.row.original;

					return (
						<LinkWithCopy
							title={info.getValue()}
							id={uuid}
							uri={`/planning/finishing-batch`}
						/>
					);
				},
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: false,
				cell: (info) => (
					<LinkWithCopy
						title={info.getValue()}
						id={info.getValue()}
						uri={`/order/details`}
					/>
				),
			},
			{
				accessorKey: 'item_description',
				header: 'Item',
				enableColumnFilter: false,
				width: 'w-44',
				cell: (info) => {
					const { order_number, order_description_uuid } =
						info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={`${order_number}/${order_description_uuid}`}
							uri={`/order/details`}
						/>
					);
				},
			},

			{
				accessorKey: 'order_type',
				header: 'Type',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'colors',
				header: 'Colors',
				enableColumnFilter: false,
				width: 'w-24',
				// cell: (info) => info.getValue().join(', '),
			},
			{
				accessorKey: 'total_batch_quantity',
				header: 'Total',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				// accessorKey: 'total_batch_production_quantity',
				accessorFn: (row) =>
					row.total_batch_quantity -
					row.total_batch_production_quantity,
				id: 'balance',
				header: 'Balance',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'production_date',
				header: (
					<div className='flex flex-col'>
						<span>Production</span>
						<span>Date</span>
					</div>
				),
				enableColumnFilter: false,
				// cell: (info) => (
				// 	<DateTime date={info.getValue()} isTime={false} />
				// ),
				cell: (info) => (
					<LinkOnly
						title={
							<DateTime date={info.getValue()} isTime={false} />
						}
						id={format(new Date(info.getValue()), 'yyyy-MM-dd')}
						uri='/planning/finishing-dashboard/batch-report'
					/>
				),
			},

			{
				accessorKey: 'status',
				header: 'Status',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: 'slider_lead_time',
			// 	header: (
			// 		<div>
			// 			Finishing Slider <br />
			// 			Lead Time
			// 		</div>
			// 	),
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorFn: (row) => {
					const { production_date, slider_lead_time } = row;
					const slider_day = subDays(
						production_date,
						Number(slider_lead_time)
					);
					const remainingDays = differenceInDays(
						slider_day,
						new Date()
					);

					return remainingDays < 0 ? 0 : remainingDays;
				},
				id: 'remaining_slider_lead_time',
				header: (
					<div>
						Remaining Date <br />
						#Slider
					</div>
				),
				enableColumnFilter: false,
				cell: (info) => {
					const { production_date, slider_lead_time } =
						info.row.original;
					const slider_day = subDays(
						production_date,
						Number(slider_lead_time)
					);

					return (
						<div>
							<span className='text-sm font-bold text-gray-600'>
								{info.getValue()} days
							</span>
							<DateTime date={slider_day} isTime={false} />
						</div>
					);
				},
			},
			// {
			// 	accessorKey: 'dyeing_lead_time',
			// 	header: (
			// 		<div>
			// 			Finishing Dyeing <br />
			// 			Lead Time
			// 		</div>
			// 	),
			// 	enableColumnFilter: false,
			// 	cell: (info) => (info.getValue() ? info.getValue() : '---'),
			// },
			{
				accessorKey: 'remaining_dyeing_lead_time',
				header: (
					<div>
						Remaining Date <br />
						#Dyeing
					</div>
				),
				enableColumnFilter: false,
				cell: (info) => {
					const { production_date, dyeing_lead_time } =
						info.row.original;
					if (dyeing_lead_time === null) return <span>---</span>;

					const dyeing_day = subDays(
						production_date,
						Number(dyeing_lead_time)
					);
					const remainingDays = differenceInDays(
						dyeing_day,
						new Date()
					);

					return (
						<div>
							<span className='text-sm font-bold text-gray-600'>
								{remainingDays < 0 ? 0 : remainingDays} days
							</span>
							<DateTime date={dyeing_day} isTime={false} />
						</div>
					);
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
				header: 'Created',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('update'),
				width: 'w-24',
				cell: (info) => (
					<EditDelete
						idx={info.row.index}
						handelUpdate={handelUpdate}
						showDelete={false}
						showUpdate={haveAccess.includes('update')}
					/>
				),
			},
		],
		[data]
	);

	const handelAdd = () => navigate('/planning/finishing-batch/entry');

	const handelUpdate = (idx) => {
		const uuid = data[idx]?.uuid;
		navigate(`/planning/finishing-batch/${uuid}/update`);
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				data={data}
				columns={columns}
				accessor={haveAccess.includes('create')}
				handelAdd={handelAdd}
			/>
		</div>
	);
}
