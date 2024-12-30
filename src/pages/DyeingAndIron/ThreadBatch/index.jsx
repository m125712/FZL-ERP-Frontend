import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useDyeingThreadBatch } from '@/state/Dyeing';
import { useDyeingCone } from '@/state/Thread';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import BatchType from '@/ui/Others/BatchType';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { DateTime, EditDelete, LinkWithCopy, Transfer } from '@/ui';

import { cn } from '@/lib/utils';
import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

export default function Index() {
	const { data, url, updateData, isLoading } = useDyeingThreadBatch();
	const { invalidateQuery } = useDyeingCone();
	const info = new PageInfo('Thread Batch', url, 'dyeing__thread_batch');
	const { user } = useAuth();
	const haveAccess = useAccess('dyeing__thread_batch');
	const navigate = useNavigate();
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
						<span>Production</span>
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
				accessorKey: 'color',
				header: 'Color',
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
				accessorKey: 'coneing_actions',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('create'),
				cell: (info) => {
					const { is_drying_complete, uuid } = info.row.original;
					return (
						<Transfer
							className='btn btn-accent btn-xs flex w-fit gap-0.5'
							onClick={() =>
								navigate(
									`/dyeing-and-iron/thread-batch/dyeing/${uuid}`
								)
							}
							disabled={is_drying_complete === 'true'}
						/>
					);
				},
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
							)}>
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
						<SwitchToggle
							disabled={isDisabled}
							onChange={() =>
								handelDryingComplete(info.row.index)
							}
							checked={info.getValue() === 'true'}
						/>
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
				width: 'w-40',
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
			// * actions
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('update'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							showUpdate={
								haveAccess.includes('update') &&
								!status[info.row.index]
							}
							showDelete={false}
						/>
					);
				},
			},
		],
		[data, status]
	);

	//Drying Completed
	const handelDryingComplete = async (idx) => {
		if (data[idx]?.is_drying_complete === null) {
			await updateData.mutateAsync({
				url: `${url}/${data[idx]?.uuid}`,
				updatedData: {
					is_drying_complete: true,
					drying_created_at: GetDateTime(),
				},
				isOnCloseNeeded: false,
			});

			invalidateQuery();
		} else {
			await updateData.mutateAsync({
				url: `${url}/${data[idx]?.uuid}`,
				updatedData: {
					is_drying_complete:
						data[idx]?.is_drying_complete === 'true' ? false : true,
					drying_updated_at: GetDateTime(),
				},
				isOnCloseNeeded: false,
			});
			invalidateQuery();
		}
	};
	// Machine
	const handleMachine = async (e, idx) => {
		if (data[idx]?.machine_uuid === null) {
			await updateData.mutateAsync({
				url: `${url}/${data[idx]?.uuid}`,
				updatedData: {
					machine_uuid: e.value,
					lab_created_by: user?.uuid,
					lab_created_at: GetDateTime(),
				},
				isOnCloseNeeded: false,
			});
		} else {
			await updateData.mutateAsync({
				url: `${url}/${data[idx]?.uuid}`,
				updatedData: {
					machine_uuid: e.value,
					lab_updated_at: GetDateTime(),
				},
				isOnCloseNeeded: false,
			});
		}
	};

	// Add
	const handelAdd = () => navigate('/dyeing-and-iron/thread-batch/entry');

	// Update
	const handelUpdate = (idx) => {
		const { uuid } = data[idx];

		navigate(`/dyeing-and-iron/thread-batch/${uuid}/update`);
	};

	// get tabname
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div>
			<ReactTable
				handelAdd={handelAdd}
				title={info.getTitle()}
				data={data}
				columns={columns}
				accessor={haveAccess.includes('create')}
			/>
		</div>
	);
}
