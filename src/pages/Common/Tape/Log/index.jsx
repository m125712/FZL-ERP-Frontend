import { useEffect } from 'react';
import ProductionLog from './ProductionLog';
import RMOrderAgainstLog from './RMOrderAgainstLog';
import RMTransferLog from './RMTransferLog/RMTransferLog';
import TapeToCoil from './TapeToCoilLog/TapeToCoil';
import TapeToDying from './TapeToDyeingLog/TapeToDying';

export default function Index() {
	useEffect(() => {
		document.title = 'Tape Log';
	}, []);
	return (
		<div>
			<RMTransferLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<RMOrderAgainstLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<ProductionLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<TapeToCoil />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<TapeToDying />
		</div>
	);
}
