import { File } from 'lucide-react';

const HandlePDF = (props) => {
	return (
		<button type='button' className='btn-filter-outline' {...props}>
			PDF
			<File className='size-4' />
		</button>
	);
};

export default HandlePDF;
