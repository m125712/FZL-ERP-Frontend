import { useEffect } from 'react';
import RMTransferLog from './RMTransferLog';
import SFGTransferLog from './TransferLog';
import SFGTransferProduction from './TransferProduction';
import RMOrderAgainstLog from './RMOrderAgainstLog';
import TapeLog from './Transfer';

export default function Index() {
	useEffect(() => {
		document.title = 'Finishing Log';
	}, []);
	return (
		<div>
			<SFGTransferLog />
			<hr className='my-6 border-2 border-dashed border-secondary/30' />
			<SFGTransferProduction />
			<hr className='my-6 border-2 border-dashed border-secondary/30' />
			<RMTransferLog />
			<hr className='my-6 border-2 border-dashed border-secondary/30' />
			{/* <RMOrderAgainstLog />
			<hr className='my-6 border-2 border-dashed border-secondary/30' /> */}
			<TapeLog />
		</div>
	);
}
