import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useAccess } from '@/hooks';

import PageInfo from '@/util/PageInfo';

import Approved from './Approved';
import PartyWise from './partyWise';

export default function Index() {
	const haveAccess = useAccess('report__approved_orders');
	const { user } = useAuth();

	const info = new PageInfo(
		'Approved orders',
		'/report/approved-orders',
		'report__approved_orders'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	return (
		<div className='flex flex-col gap-8'>
			<PartyWise />
			<Approved />
		</div>
	);
}
