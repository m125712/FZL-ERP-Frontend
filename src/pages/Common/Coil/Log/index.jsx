import { useEffect } from 'react';
import ProductionLog from './ProductionLog';
import RMOrderAgainstLog from './RMOrderAgainstLog';
import RMTransferLog from './RMTransfer';
import SFGTransferLog from './SFGTransfer';

export default function Index() {
	useEffect(() => {
		document.title = 'Coil Log';
	}, []);
	return (
		<div>
			<SFGTransferLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<RMTransferLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<ProductionLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<RMOrderAgainstLog />
		</div>
	);
}
