import { Check, CircleX } from 'lucide-react';

const Status = ({ status }) => {
	if (status) return <Check className='size-5 text-green-600' />;

	return <CircleX className='size-5 text-error' />;
};

export default Status;
