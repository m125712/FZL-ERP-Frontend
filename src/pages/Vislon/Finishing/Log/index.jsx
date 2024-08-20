import { useEffect } from "react";
import RMTransferLog from "./RMTransferLog";
import SFGTransferLog from "./SFGTransferLog";
import RMOrderAgainstLog from './RMOrderAgainstLog';
export default function Index() {
	useEffect(() => {
		document.title = "Finishing Log";
	}, []);
	return (
		<div className='container mx-auto'>
			<SFGTransferLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<RMTransferLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<RMOrderAgainstLog />
		</div>
	);
}
