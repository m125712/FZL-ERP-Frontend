import { useEffect } from 'react';

import RMOrderAgainstLog from './RMOrderAgainstLog';
import RMTransferLog from './RMTransferLog';

export default function Index() {
	useEffect(() => {
		document.title = 'Dyeing and Iron Log';
	}, []);
	return (
		<div>
			<RMTransferLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			{/* <RMOrderAgainstLog /> */}
		</div>
	);
}
