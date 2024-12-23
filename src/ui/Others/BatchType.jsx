import { cn } from '@/lib/utils';

const BatchType = ({ value }) => {
	const res = {
		normal: 'badge badge-primary',
		extra: 'badge badge-warning',
	};
	return (
		<span className={cn(res[value], 'badge-sm uppercase')}>{value}</span>
	);
};

export default BatchType;
