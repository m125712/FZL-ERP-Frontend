import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useAccess } from '@/hooks';

import { useLedgerDetailsByUUID } from '../config/query';
import Information from './Information';
import Table from './Table';

export default function Index() {
	const { uuid } = useParams();
	const haveAccess = useAccess('accounting__ledger_details');

	const { data, isLoading } = useLedgerDetailsByUUID(uuid);

	useEffect(() => {
		document.title = 'Ledger Details';
	}, []);

	// if (!recipe) return <Navigate to='/not-found' />;
	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='space-y-2'>
			<Information data={data} />
			<Table {...data} />
		</div>
	);
}
