import { useEffect } from 'react';

import ProductionLog from './ProductionLog';
import RMOrderAgainstLog from './RMOrderAgainstLog';
import RMTransferLog from './RMTransferLog';
import SFGTransferLog from './SFGTransferLog';
import StockProductionLog from './StockProductionLog';
import StockTransactionLog from './StockTransactionLog';
import TransactionLog from './TransactionLog';

export default function Index() {
	useEffect(() => {
		document.title = 'Assembly Log';
	}, []);
	return (
		<div>
			<ProductionLog />
			{/* <SFGTransferLog /> */}
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<TransactionLog />
			<RMTransferLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			{/* <RMOrderAgainstLog /> */}
			<StockProductionLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<StockTransactionLog />
		</div>
	);
}
