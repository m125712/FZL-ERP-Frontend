import ReactPaginate from 'react-paginate';

function PaginatedItems({ initialPage, totalPages, onChange, currentPage }) {
	const handlePageClick = (event) => {
		onChange(event.selected);
	};

	return (
		<ReactPaginate
			forcePage={currentPage}
			initialPage={currentPage}
			activeLinkClassName='btn-accent !bg-accent'
			pageLinkClassName='btn btn-sm bg-base-200 rounded-md h-8'
			previousClassName='hidden'
			nextClassName='hidden'
			containerClassName=' flex gap-2 items-stretch'
			breakLabel='...'
			onPageChange={handlePageClick}
			pageRangeDisplayed={2}
			pageCount={totalPages}
			renderOnZeroPageCount={null}
		/>
	);
}

export default PaginatedItems;
