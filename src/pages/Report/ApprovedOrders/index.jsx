import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useAccess } from '@/hooks';

import PageInfo from '@/util/PageInfo';

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
		<div>
			<PartyWise />
		</div>
	);
}
