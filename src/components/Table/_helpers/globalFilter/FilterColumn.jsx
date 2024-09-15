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

	// * finds the first not-null value
	const firstValue =
		getPreFilteredRowModel()
			.flatRows.find((row) => row.getValue(column.id) !== null)
			?.getValue(column.id) || null;

	if (!firstValue) return null;
	
	//console.log(typeof firstValue, column.id, firstValue);

	if (typeof firstValue === 'number')
		return <FilterNumber {...{ columnName, column, isFullFilter }} />;

	// if (isValid(new Date(firstValue || undefined))) {
	// 	return (
	// 		<FilterDate
	// 			key={column.id}
	// 			{...{ columnName, column, isFullFilter }}
	// 		/>
	// 	);
	// }

	return (
		<FilterString
			key={column.id}
			{...{ columnName, column, isFullFilter, firstValue }}
		/>
	);
};

export default FilterColumn;
