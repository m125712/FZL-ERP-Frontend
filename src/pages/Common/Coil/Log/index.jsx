import { useEffect } from 'react';
import ProductionLog from './ProductionLog';
import RMOrderAgainstLog from './RMOrderAgainstLog';
import RMTransferLog from './RMTransferLog/RMTransferLog';
import SFGTransferLog from './SFGTransferLog/SFGTransferLog';

export default function Index() {
	useEffect(() => {
		document.title = 'Coil Log';
	}, []);
	return (
		<div className='container mx-auto'>
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
