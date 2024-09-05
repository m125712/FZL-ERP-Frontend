import { isValid } from 'date-fns';
import FilterNumber from './FilterNumber';
import FilterStatus from './FilterStatus';
import FilterString from './FilterString';
import FilterDate from './FilterDate';

const FilterColumn = ({
	columnName,
	column,
	getPreFilteredRowModel,
	isFullFilter = false,
}) => {
	if (column.id.includes('status'))
		return <FilterStatus {...{ columnName, column, isFullFilter }} />;

	const firstValue = getPreFilteredRowModel().flatRows[0]?.getValue(
		column.id
	);

	if (typeof firstValue === 'number')
		return <FilterNumber {...{ columnName, column, isFullFilter }} />;

	if (isValid(new Date(firstValue))) {
		return (
			<>Date Range</>
			// <FilterDate
			// 	key={column.id}
			// 	{...{ columnName, column, isFullFilter, firstValue }}
			// />
		);
	}

	return (
		<FilterString
			key={column.id}
			{...{ columnName, column, isFullFilter, firstValue }}
		/>
	);
};

export default FilterColumn;
