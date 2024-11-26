import { lazy, useEffect, useState } from 'react';
import { useOrderFactory, useOrderParty } from '@/state/Order';
import {
	useOtherOrderPropertiesByBottomStopper,
	useOtherOrderPropertiesByColor,
	useOtherOrderPropertiesByColoringType,
	useOtherOrderPropertiesByEndType,
	useOtherOrderPropertiesByEndUser,
	useOtherOrderPropertiesByGarmentsWash,
	useOtherOrderPropertiesByHand,
	useOtherOrderPropertiesByItem,
	useOtherOrderPropertiesByLightPreference,
	useOtherOrderPropertiesByLockType,
	useOtherOrderPropertiesByLogoType,
	useOtherOrderPropertiesByNylonStopper,
	useOtherOrderPropertiesByPullerLink,
	useOtherOrderPropertiesByPullerType,
	useOtherOrderPropertiesBySlider,
	useOtherOrderPropertiesBySliderBodyShape,
	useOtherOrderPropertiesBySliderLink,
	useOtherOrderPropertiesBySpecialRequirement,
	useOtherOrderPropertiesByTeethType,
	useOtherOrderPropertiesByTopStopper,
	useOtherOrderPropertiesByZipperNumber,
	useOtherParty,
} from '@/state/Other';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';

import PageInfo from '@/util/PageInfo';

import { PartyColumns } from '../columns';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const { data, isLoading, url, deleteData } = useOrderParty();
	const { invalidateQuery: invalidatePartyAll } = useOtherParty();
	const { invalidateQuery: invalidateOrderPropertiesByBottomStopper } =
		useOtherOrderPropertiesByBottomStopper();
	const { invalidateQuery: invalidateOrderPropertiesByColor } =
		useOtherOrderPropertiesByColor();
	const { invalidateQuery: invalidateOrderPropertiesByColoringType } =
		useOtherOrderPropertiesByColoringType();
	const { invalidateQuery: invalidateOrderPropertiesByEndType } =
		useOtherOrderPropertiesByEndType();
	const { invalidateQuery: invalidateOrderPropertiesByEndUser } =
		useOtherOrderPropertiesByEndUser();
	const { invalidateQuery: invalidateOrderPropertiesByGarmentsWash } =
		useOtherOrderPropertiesByGarmentsWash();
	const { invalidateQuery: invalidateOrderPropertiesByHand } =
		useOtherOrderPropertiesByHand();
	const { invalidateQuery: invalidateOrderPropertiesByItem } =
		useOtherOrderPropertiesByItem();
	const { invalidateQuery: invalidateOrderPropertiesByLightPreference } =
		useOtherOrderPropertiesByLightPreference();
	const { invalidateQuery: invalidateOrderPropertiesByLockType } =
		useOtherOrderPropertiesByLockType();
	const { invalidateQuery: invalidateOrderPropertiesByLogoType } =
		useOtherOrderPropertiesByLogoType();
	const { invalidateQuery: invalidateOrderPropertiesByNylonStopper } =
		useOtherOrderPropertiesByNylonStopper();
	const { invalidateQuery: invalidateOrderPropertiesByPullerLink } =
		useOtherOrderPropertiesByPullerLink();
	const { invalidateQuery: invalidateOrderPropertiesByPullerType } =
		useOtherOrderPropertiesByPullerType();
	const { invalidateQuery: invalidateOrderPropertiesBySlider } =
		useOtherOrderPropertiesBySlider();
	const { invalidateQuery: invalidateOrderPropertiesBySliderBodyShape } =
		useOtherOrderPropertiesBySliderBodyShape();
	const { invalidateQuery: invalidateOrderPropertiesBySliderLink } =
		useOtherOrderPropertiesBySliderLink();
	const { invalidateQuery: invalidateOrderPropertiesBySpecialRequirement } =
		useOtherOrderPropertiesBySpecialRequirement();
	const { invalidateQuery: invalidateOrderPropertiesByTeethType } =
		useOtherOrderPropertiesByTeethType();
	const { invalidateQuery: invalidateOrderPropertiesByTopStopper } =
		useOtherOrderPropertiesByTopStopper();
	const { invalidateQuery: invalidateOrderPropertiesByZipperNumber } =
		useOtherOrderPropertiesByZipperNumber();
	const { invalidateQuery: invalidateOrderFactory } = useOrderFactory();
	const info = new PageInfo('Order/Party', url, 'order__party');
	const haveAccess = useAccess(info.getTab());

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};
	// Update
	const [updateParty, setUpdateParty] = useState({
		uuid: null,
	});

	const handelUpdate = (idx) => {
		setUpdateParty((prev) => ({
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

	const columns = PartyColumns({
		handelUpdate,
		handelDelete,
		haveAccess,
		data,
	});

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	// * invalidate queries on delete
	const invalidateDeleteArray = [
		invalidateOrderPropertiesByBottomStopper,
		invalidateOrderPropertiesByColor,
		invalidateOrderPropertiesByColoringType,
		invalidateOrderPropertiesByEndType,
		invalidateOrderPropertiesByEndUser,
		invalidateOrderPropertiesByGarmentsWash,
		invalidateOrderPropertiesByHand,
		invalidateOrderPropertiesByItem,
		invalidateOrderPropertiesByLightPreference,
		invalidateOrderPropertiesByLockType,
		invalidateOrderPropertiesByLogoType,
		invalidateOrderPropertiesByNylonStopper,
		invalidateOrderPropertiesByPullerLink,
		invalidateOrderPropertiesByPullerType,
		invalidateOrderPropertiesBySlider,
		invalidateOrderPropertiesBySliderBodyShape,
		invalidateOrderPropertiesBySliderLink,
		invalidateOrderPropertiesBySpecialRequirement,
		invalidateOrderPropertiesByTeethType,
		invalidateOrderPropertiesByTopStopper,
		invalidateOrderPropertiesByZipperNumber,
		invalidateOrderFactory,
	];

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
						updateParty,
						setUpdateParty,
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
					invalidateQuery={invalidatePartyAll}
					invalidateQueryArray={invalidateDeleteArray}
				/>
			</Suspense>
		</div>
	);
}
