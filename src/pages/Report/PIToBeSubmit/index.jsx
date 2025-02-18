import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useAccess } from '@/hooks';

import PageInfo from '@/util/PageInfo';

import MarketingWise from './MarketingWise';
import PartyWise from './PartyWise';

export default function Index() {
	const haveAccess = useAccess('report__pi_to_be_submitted');
	const { user } = useAuth();

	const info = new PageInfo(
		'PI To Be Submitted',
		'/report/pi-to-be-submitted',
		'report__pi_to_be_submitted'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	return (
		<div className='flex flex-col gap-8'>
			<PartyWise />
			<MarketingWise />
		</div>
	);
}
