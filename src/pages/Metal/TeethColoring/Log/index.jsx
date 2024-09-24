import { useEffect } from 'react';

import RMOrderAgainstLog from './RMOrderAgainstLog';
import RMTransferLog from './RMTransferLog';
import SFGTransferLog from './TransferLog';
import SFGTransferProd from './TransferProduction';

export default function Index() {
	useEffect(() => {
		document.title = 'Teeth Coloring Log';
	}, []);
	return (
		<div>
			<SFGTransferProd />
			<hr className='my-6 border-2 border-dashed border-secondary/30' />
			<SFGTransferLog />
			<hr className='my-6 border-2 border-dashed border-secondary/30' />
			<RMTransferLog />
			{/* <hr className='my-6 border-2 border-dashed border-secondary/30' />
			<RMOrderAgainstLog /> */}
		</div>
	);
}
