import { useEffect } from 'react';
import RMTransferLog from './RMTransferLog/RMTransferLog';

export default function Index() {
	useEffect(() => {
		document.title = 'Dyeing and Iron Log';
	}, []);
	return (
		<div className='container mx-auto'>
			<RMTransferLog />
		</div>
	);
}
