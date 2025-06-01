import { useEffect } from 'react';
import { useDyeingThreadBatchDetailsByUUID } from '@/state/Dyeing';
import { Navigate, useParams } from 'react-router';
import { useAccess } from '@/hooks';

import Information from './Information';
import Table from './Table';

export default function Index() {
	const { batch_uuid } = useParams();
	const haveAccess = useAccess('store__receive_by_uuid');

	const { data: batch, loading } =
		useDyeingThreadBatchDetailsByUUID(batch_uuid);

	useEffect(() => {
		document.title = 'Planning Batch Details';
	}, []);

	// if (!planningSNO) return <Navigate to='/not-found' />;
	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;

	if (!batch) return <Navigate to='/not-found' />;

	return (
		<div className='space-y-8 py-6'>
			<Information batch={batch} />
			<Table {...batch} />
		</div>
	);
}
