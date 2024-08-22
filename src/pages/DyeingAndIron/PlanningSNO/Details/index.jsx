import { useAccess, useFetch, useFetchFunc } from '@/hooks';
import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import Information from './Information';
import Table from './Table';

export default function Index() {
	const { week_id } = useParams();
	const haveAccess = useAccess('store__receive_by_uuid');

	const { value: planningSNO, loading } = useFetch(
		`/zipper/planning-details/by/${week_id}`,
		[week_id]
	);

	useEffect(() => {
		document.title = 'Planning SNO Details';
	}, []);

	// if (!planningSNO) return <Navigate to='/not-found' />;
	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='container mx-auto my-2 w-full space-y-2 px-2 md:px-4'>
			<Information planningSNO={planningSNO} />
			<Table {...planningSNO} />
		</div>
	);
}
