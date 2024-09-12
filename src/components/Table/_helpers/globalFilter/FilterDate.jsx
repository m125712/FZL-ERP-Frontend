import { CalenderIcon } from '@/assets/icons';
import { format } from 'date-fns';
import { forwardRef, useCallback, useState } from 'react';
import DatePicker from 'react-datepicker';
import {
	Button,
	DefaultConfig,
	getMinMaxDate,
	getYear,
	months,
	Select,
	utilFunc,
} from '../../components/DateRange/utils';
import { Template } from '../../components/Filter/_components';

const ExampleCustomInput = forwardRef(({ value, onClick, className }, ref) => {
	return (
		<button className={className} onClick={onClick} ref={ref}>
			<CalenderIcon className='size-4' />
			<span className='hidden text-xs sm:block lg:text-sm'>{value}</span>
		</button>
	);
});

ExampleCustomInput.displayName = 'ExampleCustomInput';
// columnName,
// 	column,
// 	getPreFilteredRowModel,
const FilterDate = ({ columnName, column, isFullFilter }) => {
	if (!column) return null;

	const { id, setFilterValue, getFacetedUniqueValues } = column;
	const minMaxDate = getMinMaxDate(getFacetedUniqueValues);

	const oldStartDate = new Date(minMaxDate.min || Date.now());
	const oldEndDate = new Date(minMaxDate.max || Date.now());
	const years = getYear({ oldStartDate, oldEndDate });

	const [startDate, setStartDate] = useState(oldStartDate);
	const [endDate, setEndDate] = useState(oldEndDate);

	const handleOnChange = useCallback(
		(dates) => {
			const [start, end] = dates;

			if (start === null && end === null)
				utilFunc(
					oldStartDate,
					oldEndDate,
					setFilterValue,
					setStartDate,
					setEndDate
				);
			else utilFunc(start, end, setFilterValue, setStartDate, setEndDate);
		},
		[column]
	);

	function CustomHeader({
		date,
		changeYear,
		changeMonth,
		decreaseMonth,
		increaseMonth,
		prevMonthButtonDisabled,
		nextMonthButtonDisabled,
	}) {
		return (
			<div className='flex w-full flex-row items-center justify-around gap-4 rounded-t-md bg-base-200 px-4 py-3.5 shadow-md transition-all duration-100 ease-in-out'>
				<Button
					onClick={decreaseMonth}
					disabled={prevMonthButtonDisabled}>
					{'<'}
				</Button>
				<Select
					className='select select-bordered select-secondary'
					value={format(date, 'yyyy')}
					onChange={({ target: { value } }) => changeYear(value)}
					options={years}
				/>
				<Select
					className='select select-bordered select-secondary'
					value={months[format(date, 'M') - 1]}
					onChange={({ target: { value } }) =>
						changeMonth(months.indexOf(value))
					}
					options={months}
				/>
				<Button
					onClick={increaseMonth}
					disabled={nextMonthButtonDisabled}>
					{'>'}
				</Button>
			</div>
		);
	}

	return (
		<Template
			key={id}
			columnName={columnName}
			onClick={() => setFilterValue(undefined)}
			// showResetButton={getFilterValue()}
		>
			<DatePicker
				selected={endDate}
				minDate={oldStartDate}
				maxDate={oldEndDate}
				endDate={endDate}
				startDate={startDate}
				onChange={handleOnChange}
				// withPortal
				renderCustomHeader={CustomHeader}
				customInput={
					<ExampleCustomInput className='btn-filter-outline h-full pr-7' />
				}
				{...DefaultConfig}
			/>
		</Template>
	);
};

export default FilterDate;
