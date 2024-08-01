import { Edit, Trash } from "@/assets/icons";

const ActionButton = ({ children, className = "", ...rest }) => {
	return (
		<button
			className="btn btn-circle btn-ghost btn-sm transition-all duration-300"
			type="button"
			{...rest}
		>
			{children}
		</button>
	);
};

function EditDelete({
	handelUpdate,
	handelDelete,
	idx,
	showAction = true,
	showDelete = true,
	showUpdate = true,
}) {
	if (!showAction) return null;
	return (
		<div className="flex w-16 items-center justify-evenly gap-2">
			{showUpdate && (
				<ActionButton onClick={() => handelUpdate(idx)}>
					<Edit className="w-6 bg-transparent text-primary" />
				</ActionButton>
			)}
			{showDelete && (
				<ActionButton onClick={() => handelDelete(idx)}>
					<Trash className="w-6 bg-transparent text-error" />
				</ActionButton>
			)}
		</div>
	);
}

export { EditDelete };
