import { useEffect } from 'react';
import RMTransferLog from './RMTransferLog';
import SFGTransferLog from './SFGTransferLog';
import RMOrderAgainstLog from './RMOrderAgainstLog';

export default function Index() {
	useEffect(() => {
		document.title = 'Teeth Molding Log';
	}, []);
	return (
		<div>
			<SFGTransferLog />
			<hr className='border-secondary-content my-6 border-2 border-dashed' />
			<RMTransferLog />
			<hr className='border-secondary-content my-6 border-2 border-dashed' />
			<RMOrderAgainstLog />
		</div>
	);
}
