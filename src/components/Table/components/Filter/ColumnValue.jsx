import { format, isValid } from 'date-fns';
import { forwardRef, Fragment, useCallback, useMemo, useState } from 'react';
import DebouncedInput from '../DebouncedInput';
import { Template } from './_components';
// import DatePicker from 'react-datepicker';
// import {
// 	Button,
// 	DefaultConfig,
// 	getMinMaxDate,
// 	getYear,
// 	months,
// 	Select,
// 	utilFunc,
// } from '@/components/Table/utils';
// import { CalenderIcon } from '@/assets/icons';

function StatusInput({ columnName, column, isFullFilter }) {
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
}

function NumberInput({ columnName, column, isFullFilter }) {
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
}

function StringInput({ columnName, column, firstValue, isFullFilter }) {
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
}

// function DateRangeInput({ columnName, column, firstValue, isFullFilter }) {
// 	if (!column) return null;

// 	const { setFilterValue, getFacetedUniqueValues } = column;
// 	const minMaxDate = getMinMaxDate(getFacetedUniqueValues);

// 	const oldStartDate = new Date(minMaxDate.min || Date.now());
// 	const oldEndDate = new Date(minMaxDate.max || Date.now());
// 	const years = getYear({ oldStartDate, oldEndDate });

// 	const [startDate, setStartDate] = useState(oldStartDate);
// 	const [endDate, setEndDate] = useState(oldEndDate);

// 	const handleOnChange = useCallback(
// 		(dates) => {
// 			const [start, end] = dates;

// 			if (start === null && end === null)
// 				utilFunc(
// 					oldStartDate,
// 					oldEndDate,
// 					setFilterValue,
// 					setStartDate,
// 					setEndDate
// 				);
// 			else utilFunc(start, end, setFilterValue, setStartDate, setEndDate);
// 		},
// 		[column]
// 	);

// 	function CustomHeader({
// 		date,
// 		changeYear,
// 		changeMonth,
// 		decreaseMonth,
// 		increaseMonth,
// 		prevMonthButtonDisabled,
// 		nextMonthButtonDisabled,
// 	}) {
// 		return (
// 			<div className='flex w-full flex-row items-center justify-around gap-4 rounded-t-md bg-base-200 px-4 py-3.5 shadow-md transition-all duration-100 ease-in-out'>
// 				<Button
// 					onClick={decreaseMonth}
// 					disabled={prevMonthButtonDisabled}>
// 					{'<'}
// 				</Button>
// 				<Select
// 					className='select select-bordered select-secondary'
// 					value={format(date, 'yyyy')}
// 					onChange={({ target: { value } }) => changeYear(value)}
// 					options={years}
// 				/>
// 				<Select
// 					className='select select-bordered select-secondary'
// 					value={months[format(date, 'M') - 1]}
// 					onChange={({ target: { value } }) =>
// 						changeMonth(months.indexOf(value))
// 					}
// 					options={months}
// 				/>
// 				<Button
// 					onClick={increaseMonth}
// 					disabled={nextMonthButtonDisabled}>
// 					{'>'}
// 				</Button>
// 			</div>
// 		);
// 	}

// 	const ExampleCustomInput = forwardRef(
// 		({ value, onClick, className }, ref) => {
// 			return (
// 				<button className={className} onClick={onClick} ref={ref}>
// 					<CalenderIcon className='size-4' />
// 					<span className='hidden text-xs sm:block lg:text-sm'>
// 						{value}
// 					</span>
// 				</button>
// 			);
// 		}
// 	);

// 	ExampleCustomInput.displayName = 'ExampleCustomInput';

// 	return (
// 		<DatePicker
// 			selected={endDate}
// 			minDate={oldStartDate}
// 			maxDate={oldEndDate}
// 			endDate={endDate}
// 			startDate={startDate}
// 			onChange={handleOnChange}
// 			withPortal
// 			renderCustomHeader={CustomHeader}
// 			customInput={
// 				<ExampleCustomInput className='btn-filter-outline h-full pr-7' />
// 			}
// 			{...DefaultConfig}
// 		/>
// 	);
// }

function FilterColumnValue({
	columnName,
	column,
	getPreFilteredRowModel,
	isFullFilter = false,
}) {
	if (column.id.includes('status'))
		return <StatusInput {...{ columnName, column, isFullFilter }} />;

	const firstValue = getPreFilteredRowModel().flatRows[0]?.getValue(
		column.id
	);

	if (typeof firstValue === 'number')
		return <NumberInput {...{ columnName, column, isFullFilter }} />;

	return (
		<StringInput
			key={column.id}
			{...{ columnName, column, isFullFilter, firstValue }}
		/>
	);
}

export default FilterColumnValue;
