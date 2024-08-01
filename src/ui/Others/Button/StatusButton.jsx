import { Check, Close } from "@/assets/icons";
import cn from "@lib/cn";

export default function StatusButton({ value = 0, showIdx = false, ...props }) {
	const Icon = value === 1 ? Check : Close;

	return (
		<button
			type="button"
			className={cn(
				`btn btn-circle bg-error font-semibold text-white`,
				value === 1 && "bg-primary",
				props.size
			)}
			{...props}
		>
			{showIdx ? props.idx : <Icon className="w-4" />}
		</button>
	);
}
