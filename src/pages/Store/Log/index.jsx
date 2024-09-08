import { useEffect } from 'react';
import AgainstOrder from './AgainstOrder';
import Trx from './Trx';
import PurchaseLog from './PurchaseLog';

export default function Index() {
	useEffect(() => {
		document.title = 'Material Log';
	}, []);

	return (
		<>
			<Trx key='TrxLog' />
			<hr className='my-6 border-2 border-dashed border-secondary/30' />
			<AgainstOrder key='OrderTrxLog' />
			<hr className='my-6 border-2 border-dashed border-secondary/30' />
			<PurchaseLog key='PurchaseLog' />
		</>
	);
}
