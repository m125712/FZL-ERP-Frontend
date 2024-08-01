import { useEffect } from "react";
import RMTransferLog from "./RMTransferLog";
import SFGTransferLog from "./SFGTransferLog";

export default function Index() {
	useEffect(() => {
		document.title = "Die Casting Log";
	}, []);
	return (
		<div className="container mx-auto">
			<RMTransferLog />
		</div>
	);
}
