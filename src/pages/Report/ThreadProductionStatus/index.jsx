import { useEffect } from 'react';

import PageInfo from '@/util/PageInfo';

import ThreadParty from './thread-party-wise';
import ThreadProduction from './thread-production';

export default function Index() {
	const info = new PageInfo(
		'Thread Production Status (Batch wise)',
		'report/thread-production-batch-wise',
		'report__thread_production_batch_wise'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	return (
		<div className='flex flex-col gap-8'>
			<ThreadProduction />
			<ThreadParty />
		</div>
	);
}
