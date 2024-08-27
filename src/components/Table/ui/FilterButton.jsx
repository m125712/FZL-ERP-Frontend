import { Column } from '@/assets/icons';

const FilterButton = ({ title, children }) => {
	return (
		<div className='dropdown'>
			<button className='btn-filter-outline'>
				<Column className='size-4' />
				<span> {title}</span>
			</button>
			<ul
				tabIndex={0}
				className='menu menu-sm dropdown-content text-primary-content bg-base-100 z-20 w-max max-w-[400px] rounded-md border border-secondary/20 p-1 shadow-md transition delay-300 ease-in-out'>
				{children}
			</ul>
		</div>
	);
};

export default FilterButton;
