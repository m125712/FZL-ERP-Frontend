import { Close } from "@/assets/icons";

export default function RemoveButton({ showButton, onClick }) {
	if (!showButton) return null;
	return (
		<div className="flex items-center justify-end">
			<Close
				className="btn btn-circle btn-ghost btn-error btn-xs text-error"
				onClick={onClick}
			/>
		</div>
	);
}
