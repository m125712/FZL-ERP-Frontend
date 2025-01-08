import { cn } from '@/lib/utils';
import { ReactSelect } from '@/ui';

export const slot = [
	{ label: 'Slot 1', value: 1 },
	{ label: 'Slot 2', value: 2 },
	{ label: 'Slot 3', value: 3 },
	{ label: 'Slot 4', value: 4 },
];

export const states = [
	{ value: 'pending', label: 'Pending' },
	{ value: 'completed', label: 'Completed' },
	{ value: 'cancelled', label: 'Cancelled' },
];

export const OrderType = ({ className, status, setStatus }) => {
	const options = [
		{ value: 'bulk', label: 'Bulk' },
		{ value: 'sample', label: 'Sample' },
		{ value: 'all', label: 'All' },
	];

	return (
		<ReactSelect
			className={cn('h-4 min-w-36 text-sm', className)}
			placeholder='Select Status'
			options={options}
			value={options?.filter((item) => item.value == status)}
			onChange={(e) => {
				setStatus(e.value);
			}}
		/>
	);
};
