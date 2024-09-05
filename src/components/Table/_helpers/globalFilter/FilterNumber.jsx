import { useCallback } from 'react';
import { DebouncedInput } from '../../components';
import { Template } from '../../components/Filter/_components';

const FilterNumber = ({ columnName, column, isFullFilter }) => {
	const { getFilterValue, setFilterValue, getFacetedMinMaxValues } = column;

	const handleMinValueChange = useCallback(
		(value) => setFilterValue((old) => [value, old?.[1]]),
		[column]
	);

	const handleMaxValueChange = useCallback(
		(value) => setFilterValue((old) => [old?.[0], value]),
		[column]
	);

	const [min, max] = getFacetedMinMaxValues() ?? [0, 0];
	const DefaultInputProps = {
		type: 'text',
		min: Number(min ?? ''),
		max: Number(max ?? ''),
		width: 'md:w-28 placeholder-gray-400',
	};

	if (!isFullFilter) {
		return (
			<div className='flex flex-col gap-1 md:flex-row'>
				<DebouncedInput
					// placeholder="Min"
					value={getFilterValue()?.[0] ?? ''}
					onChange={handleMinValueChange}
					{...DefaultInputProps}
				/>

				<DebouncedInput
					// placeholder="Max"
					value={getFilterValue()?.[1] ?? ''}
					onChange={handleMaxValueChange}
					{...DefaultInputProps}
				/>
			</div>
		);
	}

	return (
		<Template
			columnName={columnName}
			onClick={() => setFilterValue(undefined)}
			showResetButton={getFilterValue()?.[0] || getFilterValue()?.[1]}>
			<div className='flex flex-col justify-between gap-1 md:flex-row'>
				<DebouncedInput
					placeholder={`Min: ${min}`}
					value={getFilterValue()?.[0] ?? ''}
					onChange={handleMinValueChange}
					{...DefaultInputProps}
				/>

				<DebouncedInput
					placeholder={`Max: ${max}`}
					value={getFilterValue()?.[1] ?? ''}
					onChange={handleMaxValueChange}
					{...DefaultInputProps}
				/>
			</div>
		</Template>
	);
};

export default FilterNumber;
