import { useEffect } from 'react';

import AgainstOrder from './AgainstOrder';
import Booking from './Booking';
import PurchaseLog from './PurchaseLog';
import Trx from './Trx';

export default function Index({ type, accessor }) {
	useEffect(() => {
		document.title = `${type.toUpperCase()}: Log`;
	}, []);

	return (
		<div className='flex flex-col gap-6'>
			<Trx key='TrxLog' type={type} accessor={accessor} />
			{type !== 'maintenance' && (
				<Booking key='BookingLog' type={type} accessor={accessor} />
			)}

			<AgainstOrder key='OrderTrxLog' type={type} accessor={accessor} />
			<PurchaseLog key='PurchaseLog' type={type} accessor={accessor} />
		</div>
	);
}
