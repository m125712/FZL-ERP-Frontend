import { useEffect } from 'react';
import { useUtilityByUUID } from '@/state/Maintenance';
import { useParams } from 'react-router';

import Information from './Information';
import Table from './Table';

export default function Index() {
	const { utility_uuid } = useParams();

	const { data, isLoading } = useUtilityByUUID(utility_uuid);

	useEffect(() => {
		document.title = 'Utility Details';
	}, []);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className={'space-y-8'}>
			<Information utility={data} />
			<Table utility_entries={data?.utility_entries} />
		</div>
	);
}
