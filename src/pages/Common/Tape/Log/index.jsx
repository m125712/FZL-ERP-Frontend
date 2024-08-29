import { useEffect } from 'react';
import ProductionLog from './ProductionLog';
import RMTransferLog from './RMTransferLog/RMTransferLog';
import TapeToCoil from './TapeToCoilLog/TapeToCoil';
import TapeToDying from './TapeToDyeingLog/TapeToDying';
import RMOrderAgainstLog from './RMOrderAgainstLog';

export default function Index() {
	useEffect(() => {
		document.title = 'Tape Log';
	}, []);
	return (
		<div>
			<TapeToCoil />
			<hr className='border-secondary-content my-6 border-2 border-dashed' />
			<TapeToDying />
			<hr className='border-secondary-content my-6 border-2 border-dashed' />
			{/* <RMTransferLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<ProductionLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<RMOrderAgainstLog /> */}
		</div>
	);
}
