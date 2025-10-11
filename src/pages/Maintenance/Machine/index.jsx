import { lazy, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useMaintenanceMachine } from '@/state/Maintenance';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { DateTime, EditDelete, StatusButton } from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

import { sections } from './Utils';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const { data, isLoading, url, deleteData, updateData } =
		useMaintenanceMachine();
	const { user } = useAuth();
	const info = new PageInfo(
		'Maintenance/Section-Machine',
		url,
		'maintenance__section_machine'
	);
	const haveAccess = useAccess('maintenance__section_machine');
	const handelReceiveByFactoryStatus = async (idx) => {
		const { status } = data[idx];

		await updateData.mutateAsync({
			url: `/maintain/section-machine/${data[idx]?.uuid}`,
			updatedData: {
				status: status === true ? false : true,
				updated_at: GetDateTime(),
				updated_by: user?.uuid,
			},
			isOnCloseNeeded: false,
		});
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: 'status',
				header: 'Status',
				enableColumnFilter: true,
				width: 'w-24',
				cell: (info) => {
					const permission = haveAccess.includes('click_status');

					return (
						<div className='flex flex-col'>
							<SwitchToggle
								disabled={!permission}
								onChange={() => {
									handelReceiveByFactoryStatus(
										info.row.index
									);
								}}
								checked={info.getValue() === true}
							/>
						</div>
					);
				},
			},
			{
				accessorKey: 'section_machine_id',
				header: 'ID',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'section',
				header: 'Section',
				enableColumnFilter: false,
				cell: (info) =>
					sections.find((s) => s?.value === info.getValue())?.label,
			},
			{
				accessorKey: 'model_number',
				header: 'Model Number',
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
				width: 'w-32',
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
	const [updateCountLength, setUpdateCountLength] = useState({
		uuid: null,
	});

	const handelUpdate = (idx) => {
		setUpdateCountLength((prev) => ({
			...prev,
			uuid: data[idx].uuid,
		}));
		window[info.getAddOrUpdateModalId()].showModal();
	};

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
						updateCountLength,
						setUpdateCountLength,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
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
