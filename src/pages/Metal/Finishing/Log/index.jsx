import { useEffect } from 'react';
import RMTransferLog from './RMTransferLog';
import SFGTransferLog from './SFGTransferLog';
import RMOrderAgainstLog from './RMOrderAgainstLog';
import ProductionLog from './ProductionLog';
import TransactionLog from './TransactionLog';

export default function Index() {
	useEffect(() => {
		document.title = 'Finishing Log';
	}, []);
	return (
		<div>
			<ProductionLog />
			<hr className='my-6 border-2 border-dashed border-secondary/30' />
			{/* <TransactionLog /> */}
			<hr className='my-6 border-2 border-dashed border-secondary/30' />
			<RMTransferLog />
			{/* <hr className='my-6 border-2 border-dashed border-secondary-content' />
			<RMOrderAgainstLog /> */}
		</div>
	);
}
