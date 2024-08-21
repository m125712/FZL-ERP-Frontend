import { useEffect } from "react";
import ProductionLog from "./ProductionLog";
import RMTransferLog from "./RMTransferLog/RMTransferLog";
import TapeToCoil from "./TapeToCoilLog/TapeToCoil";
import TapeToDying from "./TapeToDyeingLog/TapeToDying";
import RMOrderAgainstLog from './RMOrderAgainstLog';

export default function Index() {
	useEffect(() => {
		document.title = "Tape Log";
	}, []);
	return (
		<div className='container mx-auto'>
			<TapeToCoil />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<TapeToDying />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<RMTransferLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<ProductionLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<RMOrderAgainstLog />
		</div>
	);
}
