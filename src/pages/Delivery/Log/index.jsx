import { useEffect } from 'react';

import RMOrderAgainstLog from './RMOrderAgainst';
import RMTransferLog from './RMTransfer';
import WarehouseOut from './WarehouseOut';
import WarehouseRcv from './WarehouseRCV';

export default function Index() {
	useEffect(() => {
		document.title = 'Delivery Log';
	}, []);
	return (
		<div>
			<RMTransferLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<WarehouseRcv />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<WarehouseOut />
			{/* <RMOrderAgainstLog /> */}
		</div>
	);
}
