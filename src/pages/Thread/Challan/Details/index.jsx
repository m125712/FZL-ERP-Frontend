import { useEffect, useState } from 'react';
import { useThreadChallanDetailsByUUID } from '@/state/Thread';
import { Navigate, useParams } from 'react-router-dom';

import Information from './Information';
import Table from './Table';

export default function Index() {
	const { uuid } = useParams();

	const { data, isLoading } = useThreadChallanDetailsByUUID(uuid);

	useEffect(() => {
		document.title = `Challan: ${uuid}`;
	}, [uuid]);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='space-y-2'>
			<Information challan={data} />
			<Table challan={data?.challan_entry} />
		</div>
	);
}
