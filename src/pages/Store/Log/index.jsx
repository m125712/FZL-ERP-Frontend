import { useEffect } from 'react';
import OrderTrxLog from './OrderTrxLog';
import TrxLog from './TrxLog';

export default function Index() {
	useEffect(() => {
		document.title = 'Material Log';
	}, []);

	return (
		<>
			<TrxLog key='TrxLog' />
			<hr className='border-secondary-content my-6 border-2 border-dashed' />
			<OrderTrxLog key='OrderTrxLog' />
		</>
	);
}
