import { RefreshCw } from 'lucide-react';

const HandleReload = (props) => {
	return (
		<button type='button' className='btn-filter-outline' {...props}>
			<RefreshCw className='size-4' />
		</button>
	);
};

export default HandleReload;
