import { useEffect, useState } from 'react';

export const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_all_orders')) {
		return `?all=true`;
	}
	if (
		haveAccess.includes('show_approved_orders') &&
		haveAccess.includes('show_own_orders') &&
		userUUID
	) {
		return `/by/${userUUID}?approved=true`;
	}

	if (haveAccess.includes('show_approved_orders')) {
		return '?all=false&approved=true';
	}

	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `/by/${userUUID}`;
	}

	return `?all=false`;
};

export function getRowsCount(matrix) {
	return matrix.length;
}

export function getColumnsCount(matrix) {
	const firstRow = matrix[0];
	return firstRow ? firstRow.length : 0;
}
export function getSize(matrix) {
	return {
		columns: getColumnsCount(matrix),
		rows: getRowsCount(matrix),
	};
}

export const toggleBleach = ({ item, setValue, field }) => {
	const [bleachAll, setBleachAll] = useState(null);

	useEffect(() => {
		if (bleachAll !== null) {
			item.forEach((_, index) => {
				const f = field + `[${index}].bleaching`;
				setValue(f, bleachAll === true ? 'bleach' : 'non-bleach', {
					shouldValidate: true,
					shouldDirty: true,
					shouldTouch: true,
				});
			});
		}
	}, [bleachAll, item]);

	return [bleachAll, setBleachAll];
};

export const sliderSections = [
	{ value: 'die_casting', label: 'Die Casting' },
	{ value: 'slider_assembly', label: 'Assembly' },
	{ value: 'coloring', label: 'Coloring' },
	{ value: '---', label: '---' },
];

export const types = [
	{ value: 'full', label: 'Full Order' },
	{ value: 'slider', label: 'Slider' },
	{ value: 'tape', label: 'Tape' },
];

export const provided = [
	{ value: 'completely_provided', label: 'Completely Provided' },
	{ value: 'partial_provided', label: 'Partial Provided' },
	{ value: 'not_provided', label: 'Not Provided' },
];
