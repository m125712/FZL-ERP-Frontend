import { useEffect } from 'react';

import ProductionLog from './ProductionLog';
import RMTransferLog from './RMTransferLog';
import StockTransactionLog from './StockTransactionLog';
import TransactionLog from './TransactionLog';

export default function Index() {
	useEffect(() => {
		document.title = 'Assembly Log';
	}, []);
	return (
		<div>
			<ProductionLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<TransactionLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<StockTransactionLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<RMTransferLog />
		</div>
	);
}
