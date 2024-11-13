import { useEffect } from 'react';

import AgainstOrder from './AgainstOrder';
import Booking from './Booking';
import PurchaseLog from './PurchaseLog';
import Trx from './Trx';

export default function Index() {
	useEffect(() => {
		document.title = 'Store: Log';
	}, []);

	return (
		<div className='flex flex-col gap-6'>
			<Trx key='TrxLog' />
			{/* <hr className='my-6 border-2 border-dashed border-secondary/30' /> */}
			<Booking />
			<AgainstOrder key='OrderTrxLog' />
			{/* <hr className='my-6 border-2 border-dashed border-secondary/30' /> */}
			<PurchaseLog key='PurchaseLog' />
		</div>
	);
}
