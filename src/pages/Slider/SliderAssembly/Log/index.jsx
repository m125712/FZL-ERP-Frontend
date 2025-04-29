import { useEffect } from 'react';

import ProductionLog from './ProductionLog';
import RMTransferLog from './RMTransferLog';
import StockTransactionLog from './StockTransactionLog';
import StoreIssued from './StoreIssued';
import TransactionLog from './TransactionLog';

export default function Index() {
	useEffect(() => {
		document.title = 'Making Log 2';
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
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<StoreIssued />
		</div>
	);
}
