import { Reload as ReloadIcon } from '@/assets/icons';

const HandleReload = (props) => {
	return (
		<button type='button' className='btn-filter-outline' {...props}>
			<ReloadIcon className='size-4' />
		</button>
	);
};

export default HandleReload;
