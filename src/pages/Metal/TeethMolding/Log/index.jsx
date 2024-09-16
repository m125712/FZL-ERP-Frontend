import { useEffect } from 'react';
import RMOrderAgainstLog from './RMOrderAgainstLog';
import RMTransferLog from './RM';
import TapeLog from './Transfer';
import SFGTransferLog from './TransferLog';
import SFGTransferProd from './TransferProduction';

export default function Index() {
	useEffect(() => {
		document.title = 'Teeth Molding Log';
	}, []);
	return (
		<div>
			<SFGTransferLog />
			<hr className='my-6 border-2 border-dashed border-secondary/30' />
			<SFGTransferProd />
			<hr className='my-6 border-2 border-dashed border-secondary/30' />
			<RMTransferLog />
			<hr className='my-6 border-2 border-dashed border-secondary/30' />
			{/* <RMOrderAgainstLog />
			<hr className='my-6 border-2 border-dashed border-secondary/30' /> */}
			<TapeLog />
		</div>
	);
}
