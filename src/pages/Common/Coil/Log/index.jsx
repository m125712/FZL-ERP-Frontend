import { useEffect } from 'react';
import Production from './Production';
import RMOrderAgainstLog from './RMOrderAgainstLog';
import RMTransferLog from './RMTransferLog';
import CoilToDyeing from './CoilToDyeing';

export default function Index() {
	useEffect(() => {
		document.title = 'Coil Log';
	}, []);
	return (
		<div>
			<RMTransferLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<CoilToDyeing />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<Production />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<RMOrderAgainstLog />
		</div>
	);
}
