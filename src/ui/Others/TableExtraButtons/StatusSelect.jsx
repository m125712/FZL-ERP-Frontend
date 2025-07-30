import { cn } from '@/lib/utils';

import ReactSelect from '../ReactSelect';

export const StatusSelect = ({
	className,
	status,
	setStatus,
	options = [],
	placeholder = 'Select Status',
}) => {
	return (
		<ReactSelect
			className={cn('h-4 min-w-36 text-sm', className)}
			placeholder={placeholder}
			options={options}
			value={options?.filter((item) => item.value == status)}
			onChange={(e) => {
				setStatus(e.value);
			}}
		/>
	);
};
