import { PDF } from '@/assets/icons';

const HandlePDF = (props) => {
	return (
		<button type='button' className='btn-filter-outline' {...props}>
			PDF
			<PDF className='size-4' />
		</button>
	);
};

export default HandlePDF;
