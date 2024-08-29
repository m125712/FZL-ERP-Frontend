import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useFetchFunc } from '@/hooks';

import { DateTime, EditDelete, LinkOnly, UserName } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index({ material_id = null }) {
	const { MAINTENANCE_EDIT_ACCESS } = useHaveAccess();
	const info = new PageInfo(
		'Maintenance',
		material_id === null
			? 'maintenance'
			: 'maintenance/by/material-id/' + material_id
	);
	const [maintenance, setMaintenance] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'material_name',
				header: 'Material',
				enableColumnFilter: false,
				hidden: material_id !== null,
				cell: (info) => (
					<LinkOnly
						title={info.getValue()}
						id={info.row.original.material_id}
						uri='/material'
					/>
				),
			},
			{
				accessorKey: 'quantity',
				header: 'Quantity',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'unit',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'user_name',
				header: 'User',
				enableColumnFilter: false,
				cell: (info) => {
					const { user_name, user_department } = info.row.original;
					return (
						<UserName
							name={user_name}
							department={user_department}
						/>
					);
				},
			},
			{
				accessorKey: 'description',
				header: 'Description',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !MAINTENANCE_EDIT_ACCESS,
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
						/>
					);
				},
			},
		],
		[maintenance]
	);

	// Fetching data from server
	useEffect(() => {
		useFetchFunc(info.getFetchUrl(), setMaintenance, setLoading, setError);
	}, []);

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updateMaintenance, setUpdateMaintenance] = useState({
		id: null,
		material_id: null,
	});

	const handelUpdate = (idx) => {
		setUpdateMaintenance((prev) => ({
			...prev,
			id: maintenance[idx].id,
			material_id: maintenance[idx].material_id,
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
			itemId: maintenance[idx].id,
			itemName: maintenance[idx].material_name
				.replace(/#/g, '')
				.replace(/\//g, '-'),
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className=''>
			<ReactTable
				title={info.getTitle()}
				handelAdd={handelAdd}
				accessor={MAINTENANCE_EDIT_ACCESS}
				data={maintenance}
				columns={columns}
				extraClass='py-2'
			/>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setMaintenance,
						updateMaintenance,
						setUpdateMaintenance,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={setMaintenance}
					uri={info.getDeleteUrl()}
				/>
			</Suspense>
		</div>
	);
}
