import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useOrderInfo } from '@/state/Order';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';

import PageInfo from '@/util/PageInfo';

import { SettingsColumns } from '../columns';
import { useOrderActions } from './useHandle';

export default function Index() {
	const { user } = useAuth();
	const { data, isLoading, updateData } = useOrderInfo();
	const info = new PageInfo(
		'Order/ Settings',
		'/order/settings',
		'order__settings'
	);
	const haveAccess = useAccess(info.getTab());

	const {
		handelSNOFromHeadOfficeStatus,
		handelReceiveByFactoryStatus,
		handelProductionPausedStatus,
		handelSkipSliderProduction,
		handelCancel,
	} = useOrderActions(data, updateData, user);

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = SettingsColumns({
		haveAccess,
		data,
		handelSNOFromHeadOfficeStatus,
		handelReceiveByFactoryStatus,
		handelProductionPausedStatus,
		handelSkipSliderProduction,
		handelCancel,
	});

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable title={info.getTitle()} data={data} columns={columns} />
		</div>
	);
}
