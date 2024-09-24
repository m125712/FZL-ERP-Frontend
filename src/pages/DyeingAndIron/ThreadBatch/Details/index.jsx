import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAccess, useFetch, useFetchFunc } from '@/hooks';

import Information from './Information';
import SecondTable from './SecondTable';
import Table from './Table';

export default function Index() {
	const { batch_uuid } = useParams();
	const haveAccess = useAccess('store__receive_by_uuid');

	const { value: batch, loading } = useFetch(
		`/thread/batch-details/by/${batch_uuid}`,
		[batch_uuid]
	);
	const machine_uuid = batch?.machine_uuid;

	const { value: machine } = useFetch(`/public/machine/${machine_uuid}`, [
		machine_uuid,
	]);

	useEffect(() => {
		document.title = 'Planning Batch Details';
	}, []);

	// if (!planningSNO) return <Navigate to='/not-found' />;
	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='space-y-8 py-6'>
			<Information
				batch={batch}
				water_capacity={machine?.water_capacity}
			/>
			<Table {...batch} />
			<SecondTable
				batch_entry={batch?.batch_entry}
				water_capacity={machine?.water_capacity}
				yarn_quantity={batch?.yarn_quantity}
			/>
		</div>
	);
}
