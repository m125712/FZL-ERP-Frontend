import { useEffect } from 'react';
import OrderTrxLog from './OrderTrxLog';
import TrxLog from './TrxLog';

export default function Index() {
	useEffect(() => {
		document.title = 'Material Log';
	}, []);
	return (
		<div className='container mx-auto'>
			<TrxLog key='TrxLog' />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			{/* <OrderTrxLog key="OrderTrxLog" /> */}
		</div>
	);
}
