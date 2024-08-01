const FilterButton = ({ title, children }) => {
	return (
		<div className="dropdown">
			<div
				tabIndex={0}
				role="button"
				className="btn btn-xs flex flex-nowrap rounded-full bg-secondary text-secondary-content"
			>
				{title}
			</div>
			<ul
				tabIndex={0}
				className="menu dropdown-content flex-auto rounded-md bg-secondary text-secondary-content transition delay-300 ease-in-out"
			>
				{children}
			</ul>
		</div>
	);
};

export default FilterButton;
