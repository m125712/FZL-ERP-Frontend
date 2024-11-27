import { lazy, useEffect, useState } from 'react';
import { useOrderMarketing } from '@/state/Order';
import { useOtherMarketing } from '@/state/Other';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';

import PageInfo from '@/util/PageInfo';

import { MarketingColumns } from '../columns';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const { data, isLoading, url, deleteData } = useOrderMarketing();
	const { invalidateQuery: invalidateMarketing } = useOtherMarketing();
	const info = new PageInfo('Order/Marketing', url, 'order__marketing');
	const haveAccess = useAccess('order__marketing');

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	// Add
	const handelAdd = () => window[info.getAddOrUpdateModalId()].showModal();

	// Update
	const [updateMarketing, setUpdateMarketing] = useState({
		uuid: null,
		user_uuid: null,
	});

	const handelUpdate = (idx) => {
		setUpdateMarketing((prev) => ({
			...prev,
			uuid: data[idx].uuid,
			user_uuid: data[idx].user_uuid,
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

	const columns = MarketingColumns({
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
						updateMarketing,
						setUpdateMarketing,
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
					invalidateQuery={invalidateMarketing}
				/>
			</Suspense>
		</div>
	);
}
