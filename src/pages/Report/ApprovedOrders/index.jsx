import { useEffect } from 'react';

import PageInfo from '@/util/PageInfo';

import Approved from './Approved';
import ApprovedSwatch from './ApprovedSwatch';
import PartyWise from './partyWise';

export default function Index() {
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
			<ApprovedSwatch />
		</div>
	);
}
