import { ArrowUpDown, PDF, Reload, Up } from '@/assets/icons';
import DropdownMenu from '../DropdownMenu';
import FilterButton from './FilterButton';
import Title, { AddButton, TitleOnly } from './Title';

const SortingIndicator = ({ type, canSort }) => {
	if (!canSort) return null;

	const cls =
		'h-4 w-4 text-secondary group-hover:opacity-100 transition-transform transform duration-500';

	switch (type) {
		case 'asc':
			return <Up className={`${cls} rotate-180 opacity-100`} />;
		case 'desc':
			return <Up className={`${cls} opacity-100`} />;
		default:
			return <ArrowUpDown className={`${cls} opacity-0`} />;
	}
};

const PaginationButton = ({ onClick, disabled, children }) => {
	return (
		<button
			type='button'
			className='btn-filter-outline group h-8 gap-0.5 px-2.5 py-1 text-xs disabled:bg-base-100'
			onClick={onClick}
			disabled={disabled}>
			{children}
		</button>
	);
};

const PdfButton = (props) => {
	return (
		<button type='button' className='btn-filter-outline' {...props}>
			PDF
			<PDF className='h-4 w-4' />
		</button>
	);
};

const ReloadButton = (props) => {
	return (
		<button type='button' className='btn-filter-outline' {...props}>
			<Reload className='size-4' />
		</button>
	);
};

export {
	AddButton,
	DropdownMenu,
	FilterButton,
	PaginationButton,
	PdfButton,
	SortingIndicator,
	Title,
	TitleOnly,
	ReloadButton,
};
