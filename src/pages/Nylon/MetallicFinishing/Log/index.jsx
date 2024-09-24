import { useEffect } from 'react';

import RMOrderAgainstLog from './RMOrderAgainstLog';
import RMTransferLog from './RMTransferLog';
import TapeLog from './Transfer';
import SFGTransferLog from './TransferLog';
import SFGTransferProduction from './TransferProduction';

export default function Index() {
	useEffect(() => {
		document.title = 'Finishing Log';
	}, []);
	return (
		<div>
			<SFGTransferProduction />
			<hr className='my-6 border-2 border-dashed border-secondary/30' />
			{/* <SFGTransferLog /> */}
			<RMTransferLog />
			<hr className='my-6 border-2 border-dashed border-secondary/30' />
			{/* <RMOrderAgainstLog />
			<hr className='my-6 border-2 border-dashed border-secondary/30' /> */}
			<TapeLog />
		</div>
	);
}
