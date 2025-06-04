import { useEffect } from 'react';

import PageInfo from '@/util/PageInfo';

import Zipper from './Zipper';

export default function Index() {
	const info = new PageInfo(
		'Order Status (Zipper)',
		'report/order-status-zipper',
		'report__order_status_zipper'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	return (
		<div className='flex flex-col gap-8'>
			<Zipper />
		</div>
	);
}
