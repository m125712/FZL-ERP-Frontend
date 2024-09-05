import { DebouncedInput } from '../../components';

const SearchBox = (props) => {
	return (
		<DebouncedInput
			className='lg:max-w-[400px]'
			placeholder='Search...'
			value={props.globalFilter ?? ''}
			onChange={(value) => props.setGlobalFilter(String(value))}
		/>
	);
};

export default SearchBox;
