import { useEffect } from 'react';
import Challan from '@/pages/Report/ChallanStatus/challan';

import PageInfo from '@/util/PageInfo';

export default function index() {
	const info = new PageInfo('Challan Status', null, 'report__challan_status');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	return (
		<div className='flex flex-col gap-8'>
			<Challan />
		</div>
	);
}
