import { Plus } from 'lucide-react';

const HandleEntry = (props) => {
	return (
		<button
			type='button'
			onClick={props.onClick}
			className='btn-filter-accent gap-1'>
			<Plus className='size-5' />

			<span className='hidden lg:block'>New</span>
		</button>
	);
};

export default HandleEntry;
