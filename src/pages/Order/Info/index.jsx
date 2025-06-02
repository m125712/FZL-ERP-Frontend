import { lazy, useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
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
	const { user } = useAuth();
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
		const { sno_from_head_office } = data[idx];
		await updateData.mutateAsync({
			url: `/zipper/order-info/send-from-ho/update/by/${data[idx]?.uuid}`,
			updatedData: {
				sno_from_head_office:
					sno_from_head_office === true ? false : true,
				sno_from_head_office_time:
					sno_from_head_office === true ? null : GetDateTime(),
				sno_from_head_office_by:
					sno_from_head_office === true ? null : user.uuid,
			},
			isOnCloseNeeded: false,
		});
	};

	const handelReceiveByFactoryStatus = async (idx) => {
		const { receive_by_factory, sno_from_head_office } = data[idx];

		await updateData.mutateAsync({
			url: `/zipper/order-info/receive-from-factory/update/by/${data[idx]?.uuid}`,
			updatedData: {
				receive_by_factory: receive_by_factory === true ? false : true,
				receive_by_factory_time:
					receive_by_factory === true ? null : GetDateTime(),
				receive_by_factory_by:
					receive_by_factory === true ? null : user.uuid,
			},
			isOnCloseNeeded: false,
		});
	};

	const handelProductionPausedStatus = async (idx) => {
		const { production_pause } = data[idx];
		await updateData.mutateAsync({
			url: `/zipper/order-info/production-pause/update/by/${data[idx]?.uuid}`,
			updatedData: {
				production_pause: production_pause === true ? false : true,
				production_pause_time:
					production_pause === true ? null : GetDateTime(),
				production_pause_by:
					production_pause === true ? null : user.uuid,
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
