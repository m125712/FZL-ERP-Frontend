import { lazy, useEffect, useState } from 'react';
import { useOrderProperties } from '@/state/Order.jsx';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';

import PageInfo from '@/util/PageInfo';

import { PropertiesColumns } from '../columns';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const { data, isLoading, url, deleteData } = useOrderProperties();
	const info = new PageInfo('Order/Properties', url, 'order__properties');
	const haveAccess = useAccess(info.getTab());

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updateOrderProperties, setUpdateOrderProperties] = useState({
		uuid: null,
	});

	const handelUpdate = (idx) => {
		setUpdateOrderProperties((prev) => ({
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

	const columns = PropertiesColumns({
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
						updateOrderProperties,
						setUpdateOrderProperties,
					}}
				/>

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
