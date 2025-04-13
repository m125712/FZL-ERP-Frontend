import React from 'react';

import { ReactSelect } from '@/ui';

import { cn } from '@/lib/utils';

const defaultOptions = [
	{ value: 'all', label: 'All' },
	{ value: 'pending', label: 'Pending' },
	{ value: 'completed', label: 'Completed' },
];

const zipperProductionOptions = [
	{ value: 'pending', label: 'Pending' },
	{ value: 'completed', label: 'Completed' },
	{ value: 'over_delivered', label: 'Over Delivered' },
	{ value: 'sample_pending', label: 'Sample Pending' },
	{ value: 'sample_completed', label: 'Sample Completed' },
	{ value: 'sample_over_delivered', label: 'Sample Over Delivered' },
	{ value: 'all', label: 'All' },
];

const threadProductionOptions = [
	{ value: 'pending', label: 'Pending' },
	{ value: 'completed', label: 'Completed' },
	{ value: 'over_delivered', label: 'Over Delivered' },
	{ value: 'sample_pending', label: 'Sample Pending' },
	{ value: 'sample_completed', label: 'Sample Completed' },
	{ value: 'sample_over_delivered', label: 'Sample Over Delivered' },
	{ value: 'all', label: 'All' },
];

export const ProductionStatus = ({ className, status, setStatus, page }) => {
	let options;
	switch (page) {
		case 'report__zipper_production':
			options = zipperProductionOptions;
			break;

		case 'report__thread_production':
			options = threadProductionOptions;
			break;
		case 'report__daily_challan':
			options = defaultOptions;
			break;

		default:
			options = defaultOptions;
			break;
	}

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

export const consumptionTypes = [
	{ value: 'nylon_plastic', label: 'Nylon Plastic' },
	{ value: 'nylon', label: 'Nylon' },
	{ value: 'vislon', label: 'Vislon' },
	{ value: 'metal', label: 'Metal' },
	{ value: 'all', label: 'All' },
];
