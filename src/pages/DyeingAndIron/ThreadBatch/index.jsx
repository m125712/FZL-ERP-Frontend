import { useEffect, useMemo } from 'react';
import { Plus } from '@/assets/icons';
import { useAuth } from '@/context/auth';
import { useDyeingThreadBatch } from '@/state/Dyeing';
import { useDyeingCone } from '@/state/Thread';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { DateTime, EditDelete, LinkWithCopy } from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

export default function Index() {
	const { data, url, updateData, isLoading } = useDyeingThreadBatch();
	const { invalidateQuery } = useDyeingCone();
	const info = new PageInfo('Thread Batch', url, 'dyeing__thread_batch');
	const { user } = useAuth();
	const haveAccess = useAccess('dyeing__thread_batch');
	const navigate = useNavigate();
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
				accessorKey: 'order_numbers',
				header: 'O/N',
				width: 'w-28',
				enableColumnFilter: true,
				cell: (info) => {
					const order_numbers = info.getValue();
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
				accessorKey: 'production_date',
				header: (
					<div className='flex flex-col'>
						<span>Production</span>
						<span>Date</span>
					</div>
				),
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime date={info.getValue()} isTime={false} />
				),
			},
			{
				accessorKey: 'total_cone',
				header: 'Total Qty(Cone)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'coneing_actions',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('create'),
				width: 'w-24',
				cell: (info) => {
					const { week } = info.row.original;
					return (
						<div>
							<button
								className='btn btn-accent btn-xs flex w-fit gap-0.5'
								onClick={() =>
									navigate(
										`/dyeing-and-iron/thread-batch/dyeing/${info.row.original.uuid}`
									)
								}>
								<Plus className='size-4' />
								<span>Dyeing</span>
							</button>
						</div>
					);
				},
			},
			{
				accessorKey: 'total_expected_weight',
				header: (
					<span>
						Total Expected
						<br /> Yarn Qty
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_yarn_quantity',
				header: 'Total Yarn Qty',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'machine_name',
				header: 'Machine',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: 'machine_name',
			// 	header: 'Machine',
			// 	enableColumnFilter: false,
			// 	width: 'w-60',
			// 	cell: (info) => {
			// 		const { machine_uuid } = info.row.original;

			// 		return (
			// 			<ReactSelect
			// 				className={'input-xs'}
			// 				key={machine_uuid}
			// 				placeholder='Select Machine'
			// 				options={machine ?? []}
			// 				value={machine?.filter(
			// 					(item) => item.value === machine_uuid
			// 				)}
			// 				filterOption={null}
			// 				onChange={(e) => handleMachine(e, info.row.index)}
			// 				menuPortalTarget={document.body}
			// 			/>
			// 		);
			// 	},
			// },
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
			// {
			// 	accessorKey: 'dyeing_actions',
			// 	header: 'Dyeing',
			// 	enableColumnFilter: false,
			// 	enableSorting: false,
			// 	hidden: !haveAccess.includes('update'),
			// 	width: 'w-12',
			// 	cell: (info) => (
			// 		<button
			// 			className='btn btn-ghost btn-sm size-9 rounded-full p-1'
			// 			onClick={() => handelDyeing(info.row.index)}>
			// 			<Edit className='size-6' />
			// 		</button>
			// 	),
			// },
			{
				accessorKey: 'is_drying_complete',
				header: 'Drying Completed',
				enableColumnFilter: false,
				cell: (info) => {
					const { is_drying_complete } = info.row.original;

					const access = haveAccess.includes('click_drying_status');
					const overrideAccess = haveAccess.includes(
						'click_drying_status_override'
					);
					return (
						<SwitchToggle
							disabled={
								overrideAccess
									? false
									: access
										? is_drying_complete === 'true'
										: true
							}
							onChange={() =>
								handelDryingComplete(info.row.index)
							}
							checked={info.getValue() === 'true'}
						/>
					);
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
				cell: (info) => (
					<EditDelete
						idx={info.row.index}
						handelUpdate={handelUpdate}
						showEdit={haveAccess.includes('update')}
						showDelete={false}
					/>
				),
			},
		],
		[data]
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
