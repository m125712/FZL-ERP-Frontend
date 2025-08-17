import { format } from 'date-fns';

import { cn } from '@/lib/utils';

const Body = ({ value, className = '' }) => {
	return (
		<span className={cn('text-[0.7rem] capitalize text-black', className)}>
			{value}
		</span>
	);
};

function DateTime({
	date,
	isDate = true,
	isTime = true,
	customizedDateFormate = 'dd/MM/yy',
	customizedTimeFormate = 'h:mm a',
	className = '',
	showInOneLine = false,
}) {
	if (!date) return '--';

	const customizedDate = format(new Date(date), customizedDateFormate);
	const customizedTime = format(new Date(date), customizedTimeFormate);

	if (showInOneLine)
		return (
			<div
				className={cn(
					'flex items-center justify-center gap-2',
					className
				)}
			>
				{isDate && (
					<Body
						className={isTime ? '' : 'text-md'}
						value={customizedDate}
					/>
				)}
				{isTime && (
					<Body className='text-secondary' value={customizedTime} />
				)}
			</div>
		);
	else {
		return (
			<div className={cn('flex flex-col', className)}>
				{isDate && (
					<Body
						className={isTime ? '' : 'text-md'}
						value={customizedDate}
					/>
				)}
				{isTime && (
					<Body
						className='-mt-1 text-secondary'
						value={customizedTime}
					/>
				)}
			</div>
		);
	}
}
export { DateTime };
