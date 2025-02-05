import { lazy, useEffect, useMemo, useState } from 'react';
import { useFetchFunc } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { DateTime, EditDelete, LinkOnly, UserName } from '@/ui';

import PageInfo from '@/util/PageInfo';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index({ material_id = null }) {
	const { SPARE_PARTS_EDIT_ACCESS, SPARE_PARTS_ADD_ACCESS } = useHaveAccess();
	const info = new PageInfo(
		'Spare Parts',
		material_id === null
			? 'spare-parts'
			: 'spare-parts/by/material-id/' + material_id
	);
	const [spareParts, setSpareParts] = useState([]);
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
				accessorKey: 'unit',
				header: 'Unit',
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
				accessorKey: 'user_name',
				header: 'Created By',
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
				hidden: !SPARE_PARTS_EDIT_ACCESS,
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
		[spareParts]
	);

	// Fetching data from server
	useEffect(() => {
		useFetchFunc(info.getFetchUrl(), setSpareParts, setLoading, setError);
	}, []);

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updateSpareParts, setUpdateSpareParts] = useState({
		id: null,
		material_id: null,
	});

	const handelUpdate = (idx) => {
		setUpdateSpareParts((prev) => ({
			...prev,
			id: spareParts[idx].id,
			material_id: spareParts[idx].material_id,
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
			itemId: spareParts[idx].id,
			itemName: spareParts[idx].material_name
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
				accessor={SPARE_PARTS_EDIT_ACCESS || SPARE_PARTS_ADD_ACCESS}
				data={spareParts}
				columns={columns}
			/>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setSpareParts,
						updateSpareParts,
						setUpdateSpareParts,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={setSpareParts}
					uri={info.getDeleteUrl()}
				/>
			</Suspense>
		</div>
	);
}
