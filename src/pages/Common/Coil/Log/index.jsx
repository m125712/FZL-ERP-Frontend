import { useEffect } from 'react';

import CoilToDyeing from './CoilToDyeing';
import Production from './Production';
import RMOrderAgainstLog from './RMOrderAgainstLog';
import RMTransferLog from './RMTransferLog';
import TapeDyeingStore from './Tape-Dyeing-store';
import TapeToStock from './TapeToCoilLog';
import TransferLog from './TransferLog';

export default function Index() {
	useEffect(() => {
		document.title = 'Coil Log';
	}, []);
	return (
		<div>
			<RMTransferLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<Production />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<CoilToDyeing />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<TapeDyeingStore type='coil_to_dyeing' />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<TapeDyeingStore type='coil_to_store' />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<TapeToStock />
			{/* <hr className='my-6 border-2 border-dashed border-secondary-content' />
			<RMOrderAgainstLog /> */}
			<TransferLog />
		</div>
	);
}
