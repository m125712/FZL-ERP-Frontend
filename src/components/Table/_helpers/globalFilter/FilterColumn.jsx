import { isValid } from 'date-fns';
import FilterDate from './FilterDate';
import FilterNumber from './FilterNumber';
import FilterStatus from './FilterStatus';
import FilterString from './FilterString';

const FilterColumn = ({
	columnName,
	column,
	getPreFilteredRowModel,
	isFullFilter = false,
}) => {
	// if (column.id.includes('status'))
	// 	return <FilterStatus {...{ columnName, column, isFullFilter }} />;

	const firstValue = getPreFilteredRowModel().flatRows[0]?.getValue(
		column.id
	);

	// if (!firstValue) return null;

	if (typeof firstValue === 'number')
		return <FilterNumber {...{ columnName, column, isFullFilter }} />;

	if (isValid(new Date(firstValue))) {
		return (
			<FilterDate
				key={column.id}
				{...{ columnName, column, isFullFilter }}
			/>
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
