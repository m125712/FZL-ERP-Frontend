import { useEffect } from 'react';

import Production from './Production';
import RMTransferLog from './RMTransferLog';
import Transfer from './Transfer';

export default function Index() {
	useEffect(() => {
		document.title = 'Teeth Coloring Log';
	}, []);
	return (
		<div>
			<Production />
			<hr className='my-6 border-2 border-dashed border-secondary/30' />
			{/* <Transfer />
			<hr className='my-6 border-2 border-dashed border-secondary/30' /> */}
			<RMTransferLog />
		</div>
	);
}
