import { useAccess, useFetch, useFetchFunc } from '@/hooks';
import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import Information from './Information';
import Table from './Table';

export default function Index() {
	const { batch_uuid } = useParams();
	const haveAccess = useAccess('store__receive_by_uuid');

	const { value: batch, loading } = useFetch(
		`/zipper/batch-details/${batch_uuid}`,
		[batch_uuid]
	);

	console.log(batch);

	useEffect(() => {
		document.title = 'Planning Batch Details';
	}, []);

	// if (!planningSNO) return <Navigate to='/not-found' />;
	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='space-y-2'>
			<Information batch={batch} />
			<Table {...batch} />
		</div>
	);
}
