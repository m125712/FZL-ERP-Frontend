import { useEffect } from 'react';
import { useCommercialManualPIDetails } from '@/state/Commercial';
import { useParams } from 'react-router-dom';

import Information from './Information';
import Table from './Table';

export default function Index() {
	const { manual_pi_uuid } = useParams();
	const { data, isLoading, invalidateQuery } =
		useCommercialManualPIDetails(manual_pi_uuid);

	useEffect(() => {
		invalidateQuery();
		document.title = `LC: ${manual_pi_uuid}`;
	}, [manual_pi_uuid]);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='flex flex-col gap-6'>
			<Information data={data} />
			<Table entries={data?.manual_pi_entry} />
		</div>
	);
}
