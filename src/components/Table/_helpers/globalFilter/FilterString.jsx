import { Fragment, useCallback, useMemo } from 'react';
import { DebouncedInput } from '../../components';
import { Template } from '../../components/Filter/_components';

const FilterString = ({ columnName, column, firstValue, isFullFilter }) => {
	const { id, getFacetedUniqueValues, getFilterValue, setFilterValue } =
		column;

	const sortedUniqueValues = useMemo(
		() => Array.from(getFacetedUniqueValues().keys()).sort(),
		[getFacetedUniqueValues(), firstValue]
	);

	const handleTextValueChange = useCallback(
		(e) => {
			const val = typeof e === 'string' ? e : e.target.value;
			setFilterValue(val);
		},
		[column]
	);

	if (!isFullFilter) {
		return (
			<Fragment key={id}>
				<datalist id={id + 'list'}>
					{sortedUniqueValues.slice(0, 10).map((value, index) => (
						<option
							key={
								value !== null && value !== undefined
									? value
									: `option-${index}`
							}
							value={value}
						/>
					))}
				</datalist>
				<DebouncedInput
					className={'h-9'}
					type='text'
					list={id + 'list'}
					value={getFilterValue() ?? ''}
					onChange={handleTextValueChange}
				/>
			</Fragment>
		);
	}

	return (
		<Template
			key={id}
			columnName={columnName}
			onClick={() => setFilterValue(undefined)}
			showResetButton={getFilterValue()}>
			<DebouncedInput
				type='text'
				list={id + 'list'}
				value={getFilterValue() ?? ''}
				onChange={handleTextValueChange}
			/>
			<datalist id={id + 'list'}>
				{sortedUniqueValues.slice(0, 10).map((value, index) => (
					<option
						key={
							value !== null && value !== undefined
								? value
								: `option-${index}`
						}
						value={value}
					/>
				))}
			</datalist>
		</Template>
	);
};

export default FilterString;
