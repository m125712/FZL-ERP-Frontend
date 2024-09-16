import { useEffect } from 'react';
import RMTransferLog from './RMTransferLog';
import SFGTransferLog from './TransferLog';
import SFGTransferProd from './TransferProduction';
import RMOrderAgainstLog from './RMOrderAgainstLog';
export default function Index() {
	useEffect(() => {
		document.title = 'Teeth Coloring Log';
	}, []);
	return (
		<div>
			<SFGTransferLog />
			<hr className='my-6 border-2 border-dashed border-secondary/30' />
			<SFGTransferProd />
			<hr className='my-6 border-2 border-dashed border-secondary/30' />
			<RMTransferLog />
			{/* <hr className='my-6 border-2 border-dashed border-secondary/30' />
			<RMOrderAgainstLog /> */}
		</div>
	);
}
