import { useEffect } from 'react';
import RMTransferLog from './RMTransferLog';
import RMOrderAgainstLog from './RMOrderAgainstLog';

export default function Index() {
	useEffect(() => {
		document.title = 'Coloring Log';
	}, []);
	return (
		<div>
			{/* <SFGTransferLog />
			<hr className="border-2 border-dashed border-secondary-content" /> */}
			<RMTransferLog />
			<hr className='border-secondary-content my-6 border-2 border-dashed' />
			<RMOrderAgainstLog />
		</div>
	);
}
