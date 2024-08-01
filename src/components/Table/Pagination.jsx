import { LeftArrow, RightArrow } from "@/assets/icons";
import { PaginationButton } from "./ui";

export default function Pagination({
	getState,
	setPageSize,
	setPageIndex,
	getPageCount,
	getCanPreviousPage,
	getCanNextPage,
	nextPage,
	previousPage,
}) {
	const { pageIndex, pageSize } = getState().pagination;

	return (
		<div className="mb-4 mt-4 flex select-none flex-col items-end justify-around gap-2 md:flex-row md:items-center">
			<div className="flex items-end gap-6 text-sm md:items-center">
				<span className="flex items-center gap-1 text-sm">
					<select
						className="max-w-x select select-primary select-sm"
						value={pageSize}
						onChange={(e) => setPageSize(Number(e.target.value))}
					>
						{[10, 20, 50, 100].map((pageSize) => (
							<option key={pageSize} value={pageSize}>
								{pageSize}
							</option>
						))}
					</select>
					<span className="flex items-center gap-1 text-sm">
						Rows
					</span>
				</span>
				<span className="flex items-center gap-1 text-sm">
					Go to:
					<input
						type="text"
						className="input input-sm input-primary max-w-[4rem] text-center"
						defaultValue={pageIndex + 1}
						onChange={(e) => {
							const page = e.target.value
								? Number(e.target.value) - 1
								: 0;
							const lastPage = Math.min(page, getPageCount() - 1);
							setPageIndex(lastPage);
						}}
					/>
				</span>
			</div>

			<div className="inline-flex items-center space-x-0.5 text-sm">
				<PaginationButton
					onClick={() => previousPage()}
					disabled={!getCanPreviousPage()}
					icon={
						<LeftArrow className="h-4 w-4 text-primary-content" />
					}
				/>
				<span className="inline-flex items-center space-x-0.5 rounded-md px-2 text-primary">
					<b className="mx-1">{pageIndex + 1}</b> /
					<span className="ml-1">{getPageCount()}</span>
				</span>
				<PaginationButton
					onClick={() => nextPage()}
					disabled={!getCanNextPage()}
					icon={
						<RightArrow className="h-4 w-4 text-primary-content" />
					}
				/>
			</div>
		</div>
	);
}
