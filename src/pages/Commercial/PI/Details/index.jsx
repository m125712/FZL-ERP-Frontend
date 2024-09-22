import { useEffect } from 'react';
import { useCommercialPIDetailsByPiId } from '@/state/Commercial';
import { useParams } from 'react-router-dom';

import Information from './Information';
import Table from './Table';

export default function Index() {
	const { pi_id } = useParams();
	const { data, isLoading, invalidateQuery } =
		useCommercialPIDetailsByPiId(pi_id);

	useEffect(() => {
		invalidateQuery();
		document.title = `PI: ${pi_id}`;
	}, [pi_id]);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='space-y-8 py-4'>
			<Information pi={data} />
			<Table pi={data?.pi_cash_entry} />
		</div>
	);
}
