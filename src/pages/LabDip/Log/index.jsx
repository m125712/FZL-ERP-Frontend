import { useEffect } from 'react';
import RMTransferLog from './RMTransferLog/RMTransferLog';
import RMOrderAgainstLog from './RMOrderAgainstLog';

export default function Index() {
	useEffect(() => {
		document.title = 'Dyeing and Iron Log';
	}, []);
	return (
		<div>
			<RMTransferLog />
			<hr className='border-secondary-content my-6 border-2 border-dashed' />
			<RMOrderAgainstLog />
		</div>
	);
}
