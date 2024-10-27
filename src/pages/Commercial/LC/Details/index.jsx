import { useEffect } from 'react';
import { useCommercialLCByNumber } from '@/state/Commercial';
import { useParams } from 'react-router-dom';

import Information from './Information';
import Table from './Table';

export default function Index() {
	const { lc_number } = useParams();
	const { data, isLoading, invalidateQuery } =
		useCommercialLCByNumber(lc_number);

	useEffect(() => {
		invalidateQuery();
		document.title = `LC: ${lc_number}`;
	}, [lc_number]);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='flex flex-col gap-6'>
			<Information lc={data} />
			<Table entries={data?.lc_entry} />
		</div>
	);
}
