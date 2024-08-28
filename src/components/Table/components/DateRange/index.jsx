import { format } from 'date-fns';
import { useCallback, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
	Button,
	DefaultConfig,
	getMinMaxDate,
	getYear,
	months,
	Select,
	utilFunc,
} from './utils';

export default function DateRange({ getHeaderGroups }) {
	const column = getHeaderGroups()
		.flatMap(({ headers }) => headers)
		.find(({ id }) => id === 'created_at')?.column;

	if (!column) return null;

	const { setFilterValue, getFacetedUniqueValues } = column;
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
		<DatePicker
			className='input-filter input input-sm flex w-auto items-center justify-between rounded bg-transparent font-semibold transition-all duration-100 ease-in-out'
			selected={endDate}
			minDate={oldStartDate}
			maxDate={oldEndDate}
			endDate={endDate}
			startDate={startDate}
			onChange={handleOnChange}
			selectsRange
			withPortal
			// shouldCloseOnSelect={false}
			// onChangeRaw={handleChangeRaw}
			// customInput={
			// 	<>
			// 		<input type="date" />
			// 		<input type="date" />
			// 	</>
			// }
			renderCustomHeader={CustomHeader}
			{...DefaultConfig}
		/>
	);
}
