import { lazy, useEffect, useState } from 'react';
import { useOrderInfo } from '@/state/Order';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';

import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

import { InfoColumns } from '../columns';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const { data, isLoading, url, updateData, deleteData, invalidateQuery } =
		useOrderInfo();
	const info = new PageInfo(
		'Party Description',
		url,
		'order__party_description'
	);
	const haveAccess = useAccess(info.getTab());

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updateOrderInfo, setUpdateOrderInfo] = useState({
		uuid: null,
		order_number: null,
	});

	const handelUpdate = (idx) => {
		setUpdateOrderInfo((prev) => ({
			...prev,
			uuid: data[idx].uuid,
			order_number: data[idx].order_number,
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
			itemName: data[idx].order_number,
		}));

		window[info.getDeleteModalId()].showModal();
	};
	const handelSNOFromHeadOfficeStatus = async (idx) => {
		await updateData.mutateAsync({
			url: `/zipper/order-info/send-from-ho/update/by/${data[idx]?.uuid}`,
			updatedData: {
				sno_from_head_office:
					data[idx]?.sno_from_head_office === true ? false : true,
				sno_from_head_office_time:
					data[idx]?.sno_from_head_office === true
						? null
						: GetDateTime(),
			},
			isOnCloseNeeded: false,
		});
	};

	const handelReceiveByFactoryStatus = async (idx) => {
		await updateData.mutateAsync({
			url: `/zipper/order-info/receive-from-factory/update/by/${data[idx]?.uuid}`,
			updatedData: {
				receive_by_factory:
					data[idx]?.receive_by_factory === true ? false : true,
				receive_by_factory_time:
					data[idx]?.receive_by_factory === true
						? null
						: GetDateTime(),
			},
			isOnCloseNeeded: false,
		});
	};
	const handelProductionPausedStatus = async (idx) => {
		await updateData.mutateAsync({
			url: `/zipper/order-info/production-pause/update/by/${data[idx]?.uuid}`,
			updatedData: {
				production_pause:
					data[idx]?.production_pause === true ? false : true,
			},
			isOnCloseNeeded: false,
		});
	};
	const columns = InfoColumns({
		handelUpdate,
		handelDelete,
		haveAccess,
		data,
		handelSNOFromHeadOfficeStatus,
		handelReceiveByFactoryStatus,
		handelProductionPausedStatus,
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
						updateOrderInfo,
						setUpdateOrderInfo,
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
					invalidateQuery={invalidateQuery}
				/>
			</Suspense>
		</div>
	);
}
