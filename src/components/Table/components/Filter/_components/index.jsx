import { Close, FilterIcon } from "@/assets/icons";

// export const Template = ({
// 	columnName,
// 	onClick,
// 	showResetButton = false,
// 	children,
// }) => (
// 	<details className="group overflow-hidden rounded border border-primary [&_summary::-webkit-details-marker]:hidden">
// 		<summary className="flex cursor-pointer select-none items-center justify-between gap-2 bg-white p-2 text-gray-900 transition">
// 			<span className="flex items-center gap-2 text-sm font-medium">
// 				{columnName}
// 				{showResetButton && (
// 					<button
// 						type="button"
// 						onClick={onClick}
// 						className="group/btn btn btn-circle btn-outline btn-error btn-xs"
// 					>
// 						<Close className="h-4 w-4 text-error group-hover/btn:text-primary-content" />
// 					</button>
// 				)}
// 			</span>

// 			<span className="transition group-open:-rotate-180">
// 				<svg
// 					xmlns="http://www.w3.org/2000/svg"
// 					fill="none"
// 					viewBox="0 0 24 24"
// 					strokeWidth="1.5"
// 					stroke="currentColor"
// 					className="h-4 w-4"
// 				>
// 					<path
// 						strokeLinecap="round"
// 						strokeLinejoin="round"
// 						d="M19.5 8.25l-7.5 7.5-7.5-7.5"
// 					/>
// 				</svg>
// 			</span>
// 		</summary>
// 		<div className="flex w-full flex-col gap-1 border-t border-secondary p-2">
// 			{children}
// 		</div>
// 	</details>
// );

export const Template = ({
	columnName,
	onClick,
	showResetButton = false,
	children,
}) => (
	<div className="flex flex-col gap-1 p-2">
		<span className="flex items-center gap-2 text-sm font-semibold">
			{columnName}
			{showResetButton && (
				<button
					type="button"
					className="group/btn btn btn-circle btn-outline btn-error btn-xs"
					onClick={onClick}
				>
					<Close className="h-4 w-4 text-error group-hover/btn:text-primary-content" />
				</button>
			)}
		</span>
		{children}
	</div>
);

export const DrawerBody = ({ htmlId, children }) => (
	<div className="drawer drawer-end mt-1.5 w-auto">
		<input id={htmlId} type="checkbox" className="drawer-toggle" />
		<div className="drawer-content">
			<label
				htmlFor={htmlId}
				className="btn btn-xs rounded-full bg-secondary text-secondary-content"
			>
				Filter
				<FilterIcon className="h-4 w-4" />
			</label>
		</div>
		<div className="drawer-side overflow-x-hidden">
			<label
				htmlFor={htmlId}
				aria-label="filter all columns"
				className="drawer-overlay"
			/>
			<div className="min-h-full min-w-[16.5rem] bg-base-200">
				<div className="flex items-center justify-between bg-primary p-2 text-2xl font-bold text-white">
					Filter
					<FilterIcon />
				</div>
				{children}
			</div>
		</div>
	</div>
);

export const notShowingColumns = [
	"id",
	"action",
	"actions",
	"created_at",
	"updated_at",
	"reset_password",
	"page_assign",
];

export const SlicedColumn = ({ columns }) => {
	return (
		<div>
			{columns?.map(
				({
					id,
					getIsVisible,
					getToggleVisibilityHandler,
					columnDef: { header },
				}) => {
					return (
						<li key={id} className="m-1">
							<label
								className={
									getIsVisible()
										? "border bg-primary/10"
										: "border"
								}
							>
								<input
									type="checkbox"
									className="checkbox-primary checkbox checkbox-xs rounded-full"
									checked={getIsVisible()}
									onChange={getToggleVisibilityHandler()}
								/>
								{header}
							</label>
						</li>
					);
				}
			)}
		</div>
	);
};
