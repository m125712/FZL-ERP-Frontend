import { useEffect } from 'react';

import RMOrderAgainstLog from './RMOrderAgainst';
import RMTransferLog from './RMTransfer';

export default function Index() {
	useEffect(() => {
		document.title = 'Delivery Log';
	}, []);
	return (
		<div>
			<RMTransferLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			{/* <RMOrderAgainstLog /> */}
		</div>
	);
}
