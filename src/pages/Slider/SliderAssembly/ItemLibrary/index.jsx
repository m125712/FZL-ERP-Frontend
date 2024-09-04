import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess, useFetchFunc } from '@/hooks';

import { DateTime, EditDelete, Transfer } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));
const Transaction = lazy(() => import('./Transaction'));

export default function Index() {
	const info = new PageInfo(
		'Item Stock',
		'item-library/by/slider_assembly',
		'slider__assembly_item_library'
	);

	const [itemLibrary, setItemLibrary] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const haveAccess = useAccess('slider__assembly_item_library');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'short_name',
				header: 'Short Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'stock',
				header: (
					<span>
						Stock <br /> (PCS)
					</span>
				),
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
				header: 'Created At',
				enableColumnFilter: false,
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'action',
				header: 'TRF',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_to_coloring'),
				width: 'w-24',
				cell: (info) => (
					<Transfer onClick={() => handleTransfer(info.row.index)} />
				),
			},
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
							handelDelete={handelDelete}
							showDelete={haveAccess.includes('delete')}
						/>
					);
				},
			},
		],
		[itemLibrary]
	);

	// Fetching data from server
	useEffect(() => {
		useFetchFunc(info.getFetchUrl(), setItemLibrary, setLoading, setError);
	}, []);

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updateItemLibrary, setUpdateItemLibrary] = useState({
		id: null,
	});

	const handelUpdate = (idx) => {
		setUpdateItemLibrary((prev) => ({
			...prev,
			id: itemLibrary[idx].id,
		}));
		window[info.getAddOrUpdateModalId()].showModal();
	};

	const handleTransfer = (idx) => {
		const selected = itemLibrary[idx];
		setUpdateItemLibrary((prev) => ({
			...prev,
			...selected,
		}));
		window['SliderAssemblyTransfer'].showModal();
	};

	// Delete
	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});
	const handelDelete = (idx) => {
		setDeleteItem((prev) => ({
			...prev,
			itemId: itemLibrary[idx].id,
			itemName: itemLibrary[idx].name,
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
				accessor={haveAccess.includes('create')}
				data={itemLibrary}
				columns={columns}
			/>

			<Suspense>
				<Transaction
					modalId={'SliderAssemblyTransfer'}
					{...{
						setItemLibrary,
						updateItemLibrary,
						setUpdateItemLibrary,
					}}
				/>
			</Suspense>
			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setItemLibrary,
						updateItemLibrary,
						setUpdateItemLibrary,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={setItemLibrary}
					uri={info.getDeleteUrl()}
				/>
			</Suspense>
		</div>
	);
}
