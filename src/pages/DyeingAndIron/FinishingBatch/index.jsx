import { useEffect, useMemo } from 'react';
import { useDyeingFinishingBatch } from '@/state/Dyeing';
import { differenceInDays, subDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { DateTime, EditDelete, LinkWithCopy } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function index() {
	const navigate = useNavigate();
	const haveAccess = useAccess('dyeing__finishing_batch');

	const { data, isLoading, url } = useDyeingFinishingBatch();

	const info = new PageInfo(
		'Finishing Batch',
		url,
		'dyeing__finishing_batch'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'batch_number',
				header: 'Batch No.',
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => {
					const { uuid } = info.row.original;

					return (
						<LinkWithCopy
							title={info.getValue()}
							id={uuid}
							uri={`/dyeing-and-iron/finishing-batch`}
						/>
					);
				},
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: false,
				width: 'w-36',
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
				width: 'w-36',
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
				accessorKey: 'status',
				header: 'Status',
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'order_type',
				header: 'Type',
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'colors',
				header: 'Colors',
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => info.getValue().join(', '),
			},
			{
				accessorKey: 'total_batch_quantity',
				header: 'Total',
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'production_date',
				header: 'Production Date',
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => (
					<DateTime date={info.getValue()} isTime={false} />
				),
			},
			{
				accessorKey: 'slider_lead_time',
				header: (
					<div>
						Finishing Slider <br />
						Lead Time
					</div>
				),
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'remaining_slider_lead_time',
				header: (
					<div>
						Remaining Date <br />
						Slider
					</div>
				),
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => {
					const { production_date, slider_lead_time } =
						info.row.original;
					const slider_day = subDays(
						production_date,
						Number(slider_lead_time)
					);
					const remainingDays = differenceInDays(
						slider_day,
						new Date()
					);
					return (
						<div>
							<span className='text-xs font-bold text-gray-600'>
								{remainingDays < 0 ? 0 : remainingDays} days
							</span>
							<DateTime date={slider_day} isTime={false} />
						</div>
					);
				},
			},
			{
				accessorKey: 'dyeing_lead_time',
				header: (
					<div>
						Finishing Dyeing <br />
						Lead Time
					</div>
				),
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'remaining_dyeing_lead_time',
				header: (
					<div>
						Remaining Date <br />
						Dyeing
					</div>
				),
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => {
					const { production_date, dyeing_lead_time } =
						info.row.original;

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
							<span className='text-xs font-bold text-gray-600'>
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
				width: 'w-36',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				width: 'w-36',
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

	const handelAdd = () => navigate('/dyeing-and-iron/finishing-batch/entry');

	const handelUpdate = (idx) => {
		const uuid = data[idx]?.uuid;
		navigate(`/dyeing-and-iron/finishing-batch/${uuid}/update`);
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
