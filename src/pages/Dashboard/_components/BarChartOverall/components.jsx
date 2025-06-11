import numeral from 'numeral';

export const LabelValue = ({ label, value }) => {
	return (
		<>
			<div>{label}</div>
			<div className='ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground'>
				{numeral(value).format('0a')}
			</div>
		</>
	);
};
