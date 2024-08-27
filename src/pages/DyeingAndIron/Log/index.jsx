import { useEffect } from 'react';
import RMTransferLog from './RMTransferLog/RMTransferLog';
import SFGProductionLog from './SFGProductionLog';
import SFGTransferLog from './SFGTransferLog/SFGTransferLog';
import RMOrderAgainstLog from './RMOrderAgainstLog';

export default function Index() {
	useEffect(() => {
		document.title = 'Dyeing and Iron Log';
	}, []);
	return (
		<div>
			<SFGTransferLog />
			<hr className='border-secondary-content my-6 border-2 border-dashed' />
			<SFGProductionLog />
			<hr className='border-secondary-content my-6 border-2 border-dashed' />
			<RMTransferLog />
			<hr className='border-secondary-content my-6 border-2 border-dashed' />
			<RMOrderAgainstLog />
		</div>
	);
}
