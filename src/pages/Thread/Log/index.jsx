import { useEffect } from 'react';

import Production from './Production';
import RMLog from './RMLog';

export default function Index() {
	useEffect(() => {
		document.title = 'Thread: Log';
	}, []);
	return (
		<div className='flex flex-col gap-8'>
			<Production />
			<RMLog />
		</div>
	);
}
