import { format } from 'date-fns';

import { cn } from '@/lib/utils';

const Body = ({ value, className = '' }) => {
	return (
		<span
			className={cn(
				'text-[0.7rem] font-semibold capitalize text-primary',
				className
			)}>
			{value}
		</span>
	);
};

function DateTime({ date, isDate = true, isTime = true }) {
	if (!date) return null;

	const customizedDate = format(new Date(date), 'dd/MM/yy');
	const customizedTime = format(new Date(date), 'h:mm a');

	return (
		<div className='flex flex-col'>
			{isDate && (
				<Body
					className={isTime ? '' : 'text-md'}
					value={customizedDate}
				/>
			)}
			{isTime && (
				<Body className='-mt-1 text-secondary' value={customizedTime} />
			)}
		</div>
	);
}
export { DateTime };
