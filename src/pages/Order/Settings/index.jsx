import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useOrderInfo } from '@/state/Order';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';

import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

import { SettingsColumns } from '../columns';

export default function Index() {
	const { user } = useAuth();
	const { data, isLoading, updateData } = useOrderInfo();
	const info = new PageInfo(
		'Order/ Settings',
		'/order/settings',
		'order__settings'
	);
	const haveAccess = useAccess(info.getTab());

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

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
		const { receive_by_factory } = data[idx];

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

	const handelSkipSliderProduction = async (idx) => {
		const { skip_slider_production } = data[idx];
		await updateData.mutateAsync({
			url: `/zipper/order-info/skip-slider-production/update/by/${data[idx]?.uuid}`,
			updatedData: {
				skip_slider_production:
					skip_slider_production === true ? false : true,
				skip_slider_production_time:
					skip_slider_production === true ? null : GetDateTime(),
				skip_slider_production_by:
					skip_slider_production === true ? null : user.uuid,
			},
			isOnCloseNeeded: false,
		});
	};

	const columns = SettingsColumns({
		haveAccess,
		data,
		handelSNOFromHeadOfficeStatus,
		handelReceiveByFactoryStatus,
		handelProductionPausedStatus,
		handelSkipSliderProduction,
	});

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable title={info.getTitle()} data={data} columns={columns} />
		</div>
	);
}
