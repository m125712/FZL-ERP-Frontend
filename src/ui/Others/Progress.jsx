export const Progress = ({ value }) => {
	let cls = 'progress-error tooltip-error';
	if (value >= 100) cls = 'progress-success tooltip-success';
	else if (value >= 75) cls = 'progress-primary tooltip-primary';
	else if (value >= 50) cls = 'progress-info tooltip-info';
	else if (value >= 25) cls = 'progress-warning tooltip-warning';

	return (
		<div className={`tooltip text-xs ${cls}`} data-tip={value + '%'}>
			<progress
				className={`progress w-20 ${cls}`}
				value={value}
				max='100'
			/>
		</div>
	);
};
