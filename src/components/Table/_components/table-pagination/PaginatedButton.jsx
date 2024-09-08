const PaginatedButton = ({ onClick, disabled, children }) => {
	return (
		<button
			type='button'
			className='btn-filter-outline h-8 gap-0.5 px-2.5 py-1 text-xs disabled:bg-base-100'
			onClick={onClick}
			disabled={disabled}>
			{children}
		</button>
	);
};

export default PaginatedButton;
