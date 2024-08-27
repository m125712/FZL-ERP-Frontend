import { format } from 'date-fns';

const Body = ({ value, className = '' }) => {
	return (
		<span
			className={
				'text-[0.7rem] font-semibold capitalize text-primary ' +
				className
			}>
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
			{isDate && <Body value={customizedDate} />}
			{isTime && (
				<Body value={customizedTime} className='-mt-1 text-secondary' />
			)}
		</div>
	);
}
export { DateTime };
