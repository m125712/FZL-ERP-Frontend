import { lazy, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useLibraryPolicy } from '@/state/Library';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { DateTime, EditDelete } from '@/ui';

import cn from '@/lib/cn';
import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const { data, isLoading, url, deleteData, updateData } = useLibraryPolicy();
	const info = new PageInfo('Library/Policy', url, 'library__policy');
	const haveAccess = useAccess(info.getTab());
	const { user } = useAuth();

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'type',
				header: 'Type',
				enableColumnFilter: false,

				cell: (info) => {
					return (
						<span className='capitalize'>{info.getValue()}</span>
					);
				},
			},
			{
				accessorKey: 'title',
				header: 'Title',
				enableColumnFilter: false,

				cell: (info) => {
					return (
						<span className='capitalize'>{info.getValue()}</span>
					);
				},
			},
			{
				accessorKey: 'sub_title',
				header: 'Sub Title',
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<span className='capitalize'>{info.getValue()}</span>
					);
				},
			},
			{
				accessorKey: 'url',
				header: 'URL',
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<span
							className='btn-link'
							onClick={() => window.open(info.getValue())}
						>
							{info.getValue()}
						</span>
					);
				},
			},
			{
				accessorKey: 'status',
				header: 'Status',
				// hidden: !haveAccess.includes('click_status'),
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<SwitchToggle
							onChange={() => handelStatusCheck(info.row.index)}
							checked={info.getValue() === 1}
						/>
					);
				},
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,

				cell: (info) => {
					return (
						<span className='capitalize'>{info.getValue()}</span>
					);
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated At',
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
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
				cell: (info) => (
					<EditDelete
						idx={info.row.index}
						handelUpdate={handelUpdate}
						handelDelete={handelDelete}
						showEdit={haveAccess.includes('update')}
						showDelete={haveAccess.includes('delete')}
					/>
				),
			},
		],
		[data]
	);

	// Status
	const handelStatusCheck = async (idx) => {
		await updateData.mutateAsync({
			url: `${url}/${data[idx]?.uuid}`,
			updatedData: {
				status: data[idx]?.status === 1 ? 0 : 1,
				updated_at: GetDateTime(),
				updated_by: user?.uuid,
			},
			isOnCloseNeeded: false,
		});
	};
	//invalidateLibraryPolicy();

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updatePolicy, setUpdatePolicy] = useState({
		uuid: null,
	});

	const handelUpdate = (idx) => {
		setUpdatePolicy((prev) => ({
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
			itemName: data[idx].title,
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
						updatePolicy,
						setUpdatePolicy,
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
