import { useEffect } from 'react';
import RMOrderAgainstLog from './RMOrderAgainst';
import RMTransferLog from './RMTransfer';
import SFGProductionLog from './SFGProduction';
import SFGTransferLog from './SFGTransfer';
import TapeLog from './TapeTransfer';
export default function Index() {
	useEffect(() => {
		document.title = 'Teeth Molding Log';
	}, []);
	return (
		<div>
			<SFGProductionLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<SFGTransferLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<RMTransferLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<RMOrderAgainstLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<TapeLog />
		</div>
	);
}
