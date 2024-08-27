import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useFetchFunc } from '@/hooks';

import { DateTime, EditDelete, LinkOnly, LinkWithCopy, UserName } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index({ material_id = null }) {
	const { ISSUE_EDIT_ACCESS } = useHaveAccess();

	const info = new PageInfo(
		'History',
		material_id === null ? 'issue' : 'issue/by/material-id/' + material_id
	);
	const [order, setOrder] = useState([]);
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
				accessorKey: 'isWastage',
				header: 'Wastage',
				enableColumnFilter: false,
				cell: (info) => {
					const color = info.getValue()
						? 'bg-green-200 text-green-600'
						: 'bg-red-200 text-red-600';
					return (
						<span
							className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium uppercase ${color}`}>
							{info.getValue() ? 'Yes' : 'No'}
						</span>
					);
				},
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
				hidden: !ISSUE_EDIT_ACCESS,
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
		[order]
	);

	// Fetching data from server
	useEffect(() => {
		useFetchFunc(info.getFetchUrl(), setOrder, setLoading, setError);
	}, []);

	// Update
	const [updateOrder, setUpdateOrder] = useState({
		id: null,
		order_uuid: null,
		material_id: null,
		isWastage: null,
	});

	const handelUpdate = (idx) => {
		setUpdateOrder((prev) => ({
			...prev,
			id: order[idx].id,
			order_uuid: order[idx].order_uuid,
			material_id: order[idx].material_id,
			isWastage: order[idx].isWastage,
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
			itemId: order[idx].id,
			itemName: order[idx].material_name
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
				data={order}
				columns={columns}
				extraClass='py-2'
			/>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setOrder,
						updateOrder,
						setUpdateOrder,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={setOrder}
					uri={info.getDeleteUrl()}
				/>
			</Suspense>
		</div>
	);
}
