import { Fragment, useCallback, useMemo } from 'react';

import { Template } from '../../ui';
import { DebouncedInput } from '../../utils';

const FilterString = ({ columnName, column, firstValue, isFullFilter }) => {
	const { id, getFacetedUniqueValues, getFilterValue, setFilterValue } =
		column;

	const sortedUniqueValues = useMemo(
		() => Array.from(getFacetedUniqueValues().keys()).sort(),
		[getFacetedUniqueValues(), firstValue]
	);

	const handleTextValueChange = useCallback(
		(e) => {
			let val = undefined;
			if (typeof e === 'string') {
				val = e;
			} else if (typeof e === 'object') {
				val = e[0];
			}
			setFilterValue(val);
		},
		[column]
	);

	if (!isFullFilter) {
		return (
			<Fragment key={id}>
				<datalist id={id + 'list'}>
					{sortedUniqueValues.map((value, index) => (
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
				{sortedUniqueValues.map((value, index) => (
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
