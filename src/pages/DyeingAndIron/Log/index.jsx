import { useEffect } from 'react';

import RMOrderAgainstLog from './RMOrderAgainstLog';
import RMTransferLog from './RMTransferLog';
import SFGProductionLog from './SFGProductionLog';
import SFGTransferLog from './SFGTransferLog';

export default function Index() {
	useEffect(() => {
		document.title = 'Dyeing and Iron Log';
	}, []);
	return (
		<div>
			{/* <SFGTransferLog />
			<hr className='border-secondary-content my-6 border-2 border-dashed' />
			<SFGProductionLog /> */}
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<RMTransferLog />
			{/* <hr className='border-secondary-content my-6 border-2 border-dashed' />
			<RMOrderAgainstLog /> */}
		</div>
	);
}
