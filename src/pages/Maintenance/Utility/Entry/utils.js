import { format } from 'date-fns';

export const PREDEFINED_UTILITY_TYPES = [
	'fzl_peak_hour',
	'fzl_off_hour',
	'boiler',
	'gas_generator',
	'tsl_peak_hour',
	'tsl_off_hour',
];

export const getDefaultVoltageRatio = (type) => {
	switch (type) {
		case 'fzl_peak_hour':
		case 'fzl_off_hour':
		case 'tsl_peak_hour':
		case 'tsl_off_hour':
			return 264;
		case 'boiler':
		case 'gas_generator':
			return 1;
		default:
			return 0;
	}
};

export const getDefaultUnitCost = (type) => {
	switch (type) {
		case 'fzl_peak_hour':
		case 'tsl_peak_hour':
			return 13.76;
		case 'fzl_off_hour':
		case 'tsl_off_hour':
			return 9.75;
		case 'boiler':
		case 'gas_generator':
			return 30;
		default:
			return 0;
	}
};

export const utilityEntryTypeOptions = [
	{ label: 'FZL Peak Hour', value: 'fzl_peak_hour' },
	{ label: 'FZL Off Hour', value: 'fzl_off_hour' },
	{ label: 'Boiler', value: 'boiler' },
	{ label: 'Gas Generator', value: 'gas_generator' },
	{ label: 'TSL Peak Hour', value: 'tsl_peak_hour' },
	{ label: 'TSL Off Hour', value: 'tsl_off_hour' },
];

export const convertUtilityDateDataToOptions = (utilityDateData, data) => {
	if (!utilityDateData) return [];

	// If it's an array, map over it and format each item
	if (Array.isArray(utilityDateData)) {
		const mappedData = utilityDateData.map((item) => {
			if (item?.value !== undefined && item?.label !== undefined) {
				return {
					label: format(new Date(item.label), 'dd MMM, yyyy'),
					value: item.value,
				};
			}
			return item;
		});

		// Add previous_date if it exists and is not already in the array
		if (data?.previous_date) {
			const previousDateOption = {
				label: format(new Date(data.previous_date), 'dd MMM, yyyy'),
				value: data.previous_date,
			};

			// Check if previous_date already exists in the array
			const exists = mappedData.some(
				(item) => item.value === data.previous_date
			);

			if (!exists) {
				return [...mappedData, previousDateOption];
			}
		}

		return mappedData;
	}

	// If it's a single object with value and label
	if (
		utilityDateData.value !== undefined &&
		utilityDateData.label !== undefined
	) {
		return [
			{
				label: format(new Date(utilityDateData.label), 'dd MMM, yyyy'),
				value: utilityDateData.value,
			},
		];
	}

	return [];
};
