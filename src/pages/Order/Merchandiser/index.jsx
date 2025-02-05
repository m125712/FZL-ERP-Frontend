import { lazy, useEffect, useState } from 'react';
import { useOrderMerchandiser } from '@/state/Order';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';

import PageInfo from '@/util/PageInfo';

import { MerchandiserColumns } from '../columns';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const { data, isLoading, url, deleteData } = useOrderMerchandiser();
	const info = new PageInfo('Merchandiser', url, 'order__merchandiser');
	const haveAccess = useAccess('order__merchandiser');

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updateMerchandiser, setUpdateMerchandiser] = useState({
		uuid: null,
	});

	const handelUpdate = (idx) => {
		setUpdateMerchandiser((prev) => ({
			...prev,
			uuid: data[idx].uuid,
			party_uuid: data[idx].party_uuid,
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

	const columns = MerchandiserColumns({
		handelUpdate,
		handelDelete,
		haveAccess,
		data,
	});

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
						updateMerchandiser,
						setUpdateMerchandiser,
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
