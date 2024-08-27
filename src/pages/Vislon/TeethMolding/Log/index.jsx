import { useEffect } from 'react';
import RMOrderAgainstLog from './RMOrderAgainstLog';
import RMTransferLog from './RMTransferLog';
import SFGTransferLog from './SFGTransferLog';
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
