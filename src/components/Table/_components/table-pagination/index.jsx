import { PaginationButton } from '../../ui';
import Paginated from './Paginated';
import PaginatedButton from './PaginatedButton';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TablePagination = ({
	getState,
	setPageSize,
	setPageIndex,
	getPageCount,
	getCanPreviousPage,
	getCanNextPage,
	nextPage,
	previousPage,
}) => {
	const { pageIndex, pageSize } = getState().pagination;

	return (
		<div className='rounded-b-md border-[1px] border-t-0 border-secondary/20 p-3'>
			<div className='flex items-center justify-between'>
				<div>
					<div className='flex items-center gap-2'>
						<span className='text-sm text-primary'>
							Rows per page:
						</span>
						<select
							className='max-w-x select select-secondary select-sm border-secondary/30 focus:border-secondary/30 focus:outline-base-300'
							value={pageSize}
							onChange={(e) =>
								setPageSize(Number(e.target.value))
							}>
							{[10, 20, 50, 100].map((pageSize) => (
								<option key={pageSize} value={pageSize}>
									{pageSize}
								</option>
							))}
						</select>
					</div>
				</div>

				<Paginated
					onChange={(index) => {
						setPageIndex(index);
					}}
					initialPage={pageIndex}
					currentPage={pageIndex}
					totalPages={getPageCount()}
				/>

				<div className='flex gap-4'>
					<PaginatedButton
						onClick={() => previousPage()}
						disabled={!getCanPreviousPage()}>
						<ChevronLeft className='size-4' />
						<span>Previous</span>
					</PaginatedButton>

					<PaginationButton
						onClick={() => nextPage()}
						disabled={!getCanNextPage()}>
						<span>Next</span>
						<ChevronRight className='size-4' />
					</PaginationButton>
				</div>
			</div>
		</div>
	);
};

export default TablePagination;
