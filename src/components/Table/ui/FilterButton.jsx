import { Column } from '@/assets/icons';

const FilterButton = ({ title, children }) => {
	return (
		<div className='dropdown'>
			<button type='button' className='btn-filter-outline'>
				<Column className='size-5' />
				<span className='hidden lg:block'> {title}</span>
			</button>
			<ul
				tabIndex={0}
				className='menu dropdown-content menu-sm z-20 max-h-[300px] w-max max-w-[400px] rounded-md border border-secondary/20 bg-base-100 p-1 text-primary-content shadow-md transition delay-300 ease-in-out'>
				{children}
			</ul>
		</div>
	);
};

export default FilterButton;
