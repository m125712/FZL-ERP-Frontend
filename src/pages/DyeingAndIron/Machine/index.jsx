import { lazy, useEffect, useMemo, useState } from 'react';
import { useOtherMachines } from '@/state/Other';
import { useThreadMachine } from '@/state/Thread';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { DateTime, EditDelete, StatusButton } from '@/ui';

import PageInfo from '@/util/PageInfo';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const { data, isLoading, url, deleteData, updateData } = useThreadMachine();
	const { invalidateQuery: invalidateOtherThreadMachine } =
		useOtherMachines();
	const info = new PageInfo('Machine', url, 'thread__machine');
	const haveAccess = useAccess('dyeing__machine');
	const columns = useMemo(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'min_capacity',
				header: (
					<>
						Min Capacity
						<br /> (kg)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'max_capacity',
				header: (
					<>
						Max Capacity
						<br /> (kg)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'is_nylon',
				header: 'Nylon',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('update'),
				cell: (info) => (
					<StatusButton size='btn-xs' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'is_metal',
				header: 'Metal',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('update'),
				cell: (info) => (
					<StatusButton size='btn-xs' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'is_vislon',
				header: 'Vislon',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('update'),
				cell: (info) => (
					<StatusButton size='btn-xs' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'is_sewing_thread',
				header: 'Thread',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('update'),
				cell: (info) => (
					<StatusButton size='btn-xs' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'is_bulk',
				header: 'Bulk',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('update'),
				cell: (info) => (
					<StatusButton size='btn-xs' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'is_sample',
				header: 'Sample',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('update'),
				cell: (info) => (
					<StatusButton size='btn-xs' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'water_capacity',
				header: 'Water Capacity',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
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
				filterFn: 'isWithinRange',
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
				hidden:
					!haveAccess.includes('update') &&
					!haveAccess.includes('delete'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes('delete')}
							showUpdate={haveAccess.includes('update')}
						/>
					);
				},
			},
		],
		[data]
	);

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updateMachine, setUpdateMachine] = useState({
		uuid: null,
	});

	const handelUpdate = (idx) => {
		setUpdateMachine((prev) => ({
			...prev,
			uuid: data[idx].uuid,
		}));
		window[info.getAddOrUpdateModalId()].showModal();
	};
	// const handelNylonStatusChange = async (idx) => {
	// 	await updateData.mutateAsync({
	// 		url: `${url}/${data[idx]?.uuid}`,
	// 		updatedData: {
	// 			is_nylon: data[idx]?.is_nylon === 1 ? 0 : 1,
	// 			updated_at: GetDateTime(),
	// 		},
	// 		isOnCloseNeeded: false,
	// 	});
	// };
	// const handelMetalStatusChange = async (idx) => {
	// 	await updateData.mutateAsync({
	// 		url: `${url}/${data[idx]?.uuid}`,
	// 		updatedData: {
	// 			is_metal: data[idx]?.is_metal === 1 ? 0 : 1,
	// 			updated_at: GetDateTime(),
	// 		},
	// 		isOnCloseNeeded: false,
	// 	});
	// };

	// const handelVislonStatusChange = async (idx) => {
	// 	await updateData.mutateAsync({
	// 		url: `${url}/${data[idx]?.uuid}`,
	// 		updatedData: {
	// 			is_vislon: data[idx]?.is_vislon === 1 ? 0 : 1,
	// 			updated_at: GetDateTime(),
	// 		},
	// 		isOnCloseNeeded: false,
	// 	});
	// };

	// const handelSewingThreadStatusChange = async (idx) => {
	// 	await updateData.mutateAsync({
	// 		url: `${url}/${data[idx]?.uuid}`,
	// 		updatedData: {
	// 			is_sewing_thread: data[idx]?.is_sewing_thread === 1 ? 0 : 1,
	// 			updated_at: GetDateTime(),
	// 		},
	// 	});
	// };
	// const handelBulkStatusChange = async (idx) => {
	// 	await updateData.mutateAsync({
	// 		url: `${url}/${data[idx]?.uuid}`,
	// 		updatedData: {
	// 			is_bulk: data[idx]?.is_bulk === 1 ? 0 : 1,
	// 			updated_at: GetDateTime(),
	// 		},
	// 		isOnCloseNeeded: false,
	// 	});
	// };

	// const handelSampleStatusChange = async (idx) => {
	// 	await updateData.mutateAsync({
	// 		url: `${url}/${data[idx]?.uuid}`,
	// 		updatedData: {
	// 			is_sample: data[idx]?.is_sample === 1 ? 0 : 1,
	// 			updated_at: GetDateTime(),
	// 		},
	// 		isOnCloseNeeded: false,
	// 	});
	// };

	// Delete
	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handelDelete = (idx) => {
		setDeleteItem((prev) => ({
			...prev,
			itemId: data[idx].uuid,
			itemName: data[idx].name,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				handelAdd={handelAdd}
				accessor={haveAccess.includes('create')}
				data={data}
				columns={columns}
			/>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateMachine,
						setUpdateMachine,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					invalidateQuery={invalidateOtherThreadMachine}
					{...{
						deleteItem,
						setDeleteItem,
						url,
						deleteData,
					}}
				/>
			</Suspense>
		</div>
	);
}
