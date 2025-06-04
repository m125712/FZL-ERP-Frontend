import { useEffect } from 'react';

import PageInfo from '@/util/PageInfo';

import Thread from './Thread';

export default function Index() {
	const info = new PageInfo(
		'Order Status (Thread)',
		'report/order-status-thread',
		'report__order_status_thread'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	return (
		<div className='flex flex-col gap-8'>
			<Thread />
		</div>
	);
}
