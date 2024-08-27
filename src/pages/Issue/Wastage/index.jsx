import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useFetchFunc } from '@/hooks';

import { DateTime, EditDelete, LinkOnly, LinkWithCopy } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index({ material_id = null }) {
	const { WASTAGE_EDIT_ACCESS } = useHaveAccess();
	const info = new PageInfo(
		'Wastage',
		material_id === null
			? 'wastage'
			: 'wastage/by/material-id/' + material_id
	);
	const [wastage, setWastage] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: false,
				cell: (info) => (
					<LinkWithCopy id={info.getValue()} uri='/order/details' />
				),
			},
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
				accessorKey: 'assigned_quantity',
				header: 'Quantity',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'material_unit',
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
				hidden: !WASTAGE_EDIT_ACCESS,
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
		[wastage]
	);

	// Fetching data from server
	useEffect(() => {
		useFetchFunc(info.getFetchUrl(), setWastage, setLoading, setError);
	}, []);

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updateWastage, setUpdateWastage] = useState({
		id: null,
		order_uuid: null,
		material_id: null,
	});

	const handelUpdate = (idx) => {
		setUpdateWastage((prev) => ({
			...prev,
			id: wastage[idx].id,
			order_uuid: wastage[idx].order_uuid,
			material_id: wastage[idx].material_id,
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
			itemId: wastage[idx].id,
			itemName: wastage[idx].material_name
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
				accessor={WASTAGE_EDIT_ACCESS}
				data={wastage}
				columns={columns}
				extraClass='py-2'
			/>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setWastage,
						updateWastage,
						setUpdateWastage,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={setWastage}
					uri={info.getDeleteUrl()}
				/>
			</Suspense>
		</div>
	);
}
