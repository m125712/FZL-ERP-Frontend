import { useCallback } from 'react';
import { Template } from '../../components/Filter/_components';

const FilterStatus = ({ columnName, column, isFullFilter }) => {
	const { setFilterValue } = column;

	const handleStatusChange = useCallback(
		(e) => {
			const val =
				Number(e.target.value) === -1
					? undefined
					: Number(e.target.value);
			setFilterValue([val, val]);
		},
		[column]
	);

	const selectClass =
		'select select-secondary select-sm h-10 w-full border-[1px] border-gray-300 text-sm text-primary focus:border-gray-300 focus:outline-secondary/30';

	if (!isFullFilter) {
		return (
			<select
				className={selectClass}
				defaultValue={-1}
				onChange={handleStatusChange}>
				<option value='-1'>All</option>
				<option value='0'>Inactive</option>
				<option value='1'>Active</option>
			</select>
		);
	}

	return (
		<Template
			columnName={columnName}
			onClick={() => setFilterValue(undefined)}>
			<select
				className={selectClass}
				defaultValue={-1}
				onChange={handleStatusChange}>
				<option value='-1'>All</option>
				<option value='0'>Inactive</option>
				<option value='1'>Active</option>
			</select>
		</Template>
	);
};

export default FilterStatus;
