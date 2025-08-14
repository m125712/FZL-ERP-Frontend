import { useCallback } from 'react';

import GetDateTime from '@/util/GetDateTime';

export const useOrderActions = (data, updateData, user) => {
	const toggleStatus = useCallback(
		async (idx, key, urlPath) => {
			const currentValue = data[idx]?.[key];
			await updateData.mutateAsync({
				url: `/zipper/order-info/${urlPath}/update/by/${data[idx]?.uuid}`,
				updatedData: {
					[key]: currentValue ? false : true,
					[`${key}_time`]: currentValue ? null : GetDateTime(),
					[`${key}_by`]: currentValue ? null : user.uuid,
				},
				isOnCloseNeeded: false,
			});
		},
		[data, updateData, user]
	);

	const handelSNOFromHeadOfficeStatus = useCallback(
		(idx) => toggleStatus(idx, 'sno_from_head_office', 'send-from-ho'),
		[toggleStatus]
	);

	const handelReceiveByFactoryStatus = useCallback(
		(idx) =>
			toggleStatus(idx, 'receive_by_factory', 'receive-from-factory'),
		[toggleStatus]
	);

	const handelProductionPausedStatus = useCallback(
		(idx) => toggleStatus(idx, 'production_pause', 'production-pause'),
		[toggleStatus]
	);

	const handelSkipSliderProduction = useCallback(
		(idx) =>
			toggleStatus(
				idx,
				'skip_slider_production',
				'skip-slider-production'
			),
		[toggleStatus]
	);

	const handelCancel = useCallback(
		(idx) => toggleStatus(idx, 'is_cancelled', 'is-cancelled'),
		[toggleStatus]
	);

	return {
		handelSNOFromHeadOfficeStatus,
		handelReceiveByFactoryStatus,
		handelProductionPausedStatus,
		handelSkipSliderProduction,
		handelCancel,
	};
};
