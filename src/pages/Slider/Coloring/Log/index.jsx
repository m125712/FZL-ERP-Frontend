import { useEffect } from "react";
import RMTransferLog from "./RMTransferLog";
import RMOrderAgainstLog from './RMOrderAgainstLog';

export default function Index() {
	useEffect(() => {
		document.title = "Coloring Log";
	}, []);
	return (
		<div className='container mx-auto'>
			{/* <SFGTransferLog />
			<hr className="border-2 border-dashed border-secondary-content" /> */}
			<RMTransferLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<RMOrderAgainstLog />
		</div>
	);
}
