import { useEffect } from 'react';

import Production from './Production';
import RMTransferLog from './RMTransferLog';

export default function Index() {
	useEffect(() => {
		document.title = 'Finishing Log';
	}, []);
	return (
		<div className='flex flex-col gap-6'>
			<Production />
			<RMTransferLog />
		</div>
	);
}
