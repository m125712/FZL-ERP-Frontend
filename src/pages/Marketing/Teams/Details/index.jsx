import { useEffect } from 'react';
import { useParams } from 'react-router-dom';


import Information from './Information';
import Table from './Table';
import { useMarketingTeamDetails } from '@/state/Marketing';

export default function Index() {
	const { team_uuid } = useParams();

	const { data, isLoading, invalidateQuery } =
		useMarketingTeamDetails(team_uuid);

	useEffect(() => {
		invalidateQuery();
		document.title = `Marketing Team: ${team_uuid}`;
	}, [team_uuid]);


	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='flex flex-col gap-6'>
			<Information data={data} />
			<Table entries={data?.marketing_team_entry} />
		</div>
	);
}
