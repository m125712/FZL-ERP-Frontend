import { useEffect } from 'react';
import RMTransferLog from './RMTransferLog';

export default function Index() {
	useEffect(() => {
		document.title = 'Delivery Log';
	}, []);
	return (
		<div className='container mx-auto'>
			<RMTransferLog />
		</div>
	);
}
