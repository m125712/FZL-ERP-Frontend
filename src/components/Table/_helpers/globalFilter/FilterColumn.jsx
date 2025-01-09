import { isValid } from 'date-fns';

import { getFirstValue } from '../../utils';
import FilterDate from './FilterDate';
import FilterNumber from './FilterNumber';
import FilterStatus from './FilterStatus';
import FilterString from './FilterString';

//! Global Filter
//! Global Filter
//! Global Filter
const FilterColumn = ({
	columnName,
	column,
	getPreFilteredRowModel,
	isFullFilter = false,
}) => {
	// * finds the first not-null value
	const firstValue = getFirstValue({
		getPreFilteredRowModel,
		id: column.id,
	});

	if (!firstValue) return null;

	const type = typeof firstValue;
	switch (type) {
		case 'undefined':
			return null;
		case 'number':
			return <FilterNumber {...{ columnName, column, isFullFilter }} />;
	}

	return (
		<FilterString
			key={column.id}
			{...{ columnName, column, isFullFilter, firstValue }}
		/>
	);
};

export default FilterColumn;
