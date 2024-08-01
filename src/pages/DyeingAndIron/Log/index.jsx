import { useEffect } from "react";
import RMTransferLog from "./RMTransferLog/RMTransferLog";
import SFGProductionLog from "./SFGProductionLog";
import SFGTransferLog from "./SFGTransferLog/SFGTransferLog";

export default function Index() {
	useEffect(() => {
		document.title = "Dyeing and Iron Log";
	}, []);
	return (
		<div className="container mx-auto">
			<SFGTransferLog />
			<hr className="my-6 border-2 border-dashed border-secondary-content" />
			<SFGProductionLog />
			<hr className="my-6 border-2 border-dashed border-secondary-content" />
			<RMTransferLog />
		</div>
	);
}
