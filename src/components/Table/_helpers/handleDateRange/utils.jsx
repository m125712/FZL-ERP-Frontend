import { addDays, format, isAfter, isBefore } from 'date-fns';
import Cookies from 'js-cookie';
import { useMemo } from 'react';

export const DateFormate = (date) => format(date, 'yyyy-MM-dd') + ' 23:59:59';

export const DefaultConfig = {
	dateFormat: 'dd/MM/yy',
	selectsRange: true,
	isClearable: true,
	closeOnScroll: true,
	fixedHeight: true,
	weekDayClassName: () => 'font-medium text-primary ',
	peekNextMonth: true,
};

// Button Component
export const Button = ({ onClick, disabled, children }) => (
	<button
		className='btn btn-circle btn-primary btn-sm rounded-full'
		onClick={onClick}
		disabled={disabled}>
		{children}
	</button>
);

// Select Component
export const Select = ({ value, onChange, options }) => (
	<select
		className='text-md select select-primary select-sm flex flex-1 items-center justify-between rounded-md font-semibold text-primary shadow-md transition-all duration-100 ease-in-out'
		value={value}
		onChange={onChange}>
		{options?.map((option) => (
			<option key={option} value={option}>
				{option}
			</option>
		))}
	</select>
);

// Util Function
export const utilFunc = (
	start,
	end,
	setFilterValue,
	setStartDate,
	setEndDate
) => {
	setStartDate(start);
	setEndDate(end);

	const startFilter = DateFormate(addDays(start, -1));
	const endFilter = DateFormate(end || start);

	setFilterValue([startFilter, endFilter]);

	Cookies.set('startDate', startFilter);
	Cookies.set('endDate', endFilter);
};

export const date_regex = /^\d{2}\/\d{2}\/\d{4}$/;
export const handleChangeRaw = (rawInput) => {
	if (date_regex.test(rawInput)) {
		// setPlaceholder(rawInput);
		localStorage.setItem('date', rawInput);
	} else {
		if (rawInput === '') {
			let dateStr = localStorage.getItem('date');
			localStorage.setItem('date', dateStr);
			// setPlaceholder(localStorage.getItem("date"));
		}
	}
};

export const getMinMaxDate = (getFacetedUniqueValues) => {
	const allValues = getFacetedUniqueValues() ?? new Map();
	const minMaxDate = Array.from(allValues.keys()).reduce(
		(acc, date) => {
			const currentDate = new Date(date);
			if (!acc.min || isBefore(currentDate, acc.min)) {
				acc.min = date;
			}
			if (!acc.max || isAfter(currentDate, acc.max)) {
				acc.max = date;
			}
			return acc;
		},
		{ min: null, max: null }
	);

	// console.log({
	// 	// minMaxDate,
	// 	min: new Date(minMaxDate?.min),
	// 	max: new Date(minMaxDate?.max),
	// });

	return minMaxDate;
};

export const months = [
	'JAN',
	'FEB',
	'MAR',
	'APR',
	'MAY',
	'JUN',
	'JUL',
	'AUG',
	'SEP',
	'OCT',
	'NOV',
	'DEC',
];

export const getYear = ({ oldStartDate, oldEndDate }) => {
	const { years } = useMemo(() => {
		const years = Array.from(
			{
				length:
					oldEndDate.getFullYear() - oldStartDate.getFullYear() + 1,
			},
			(_, i) => i + oldStartDate.getFullYear()
		);

		return { years };
	}, [oldStartDate, oldEndDate]);

	return years;
};
