import { addDays, format } from "date-fns";
import Cookies from "js-cookie";
import { useCallback, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateFormate = (date) => format(date, "yyyy-MM-dd") + " 23:59:59";

const DefaultConfig = {
	dateFormat: "dd/MM/yy",
	selectsRange: true,
	isClearable: true,
	closeOnScroll: true,
	fixedHeight: true,
	weekDayClassName: () => "font-semibold text-primary",
	peekNextMonth: true,
};

// Button Component
const Button = ({ onClick, disabled, children }) => (
	<button
		className="btn btn-circle btn-primary btn-xs rounded-full"
		onClick={onClick}
		disabled={disabled}
	>
		{children}
	</button>
);

// Select Component
const Select = ({ value, onChange, options }) => (
	<select
		className="select select-primary select-xs flex w-auto items-center justify-between rounded-full font-semibold text-primary shadow-md transition-all duration-100 ease-in-out"
		value={value}
		onChange={onChange}
	>
		{options?.map((option) => (
			<option key={option} value={option}>
				{option}
			</option>
		))}
	</select>
);

// Util Function
const utilFunc = (start, end, setFilterValue, setStartDate, setEndDate) => {
	setStartDate(start);
	setEndDate(end);

	const startFilter = DateFormate(addDays(start, -1));
	const endFilter = DateFormate(end || start);

	setFilterValue([startFilter, endFilter]);

	Cookies.set("startDate", startFilter);
	Cookies.set("endDate", endFilter);
};

//
const date_regex = /^\d{2}\/\d{2}\/\d{4}$/;
const handleChangeRaw = (rawInput) => {
	// console.log(rawInput.target.value);
	// if (date_regex.test(rawInput)) {
	// 	setPlaceholder(rawInput);
	// 	localStorage.setItem("date", rawInput);
	// } else {
	// 	if (rawInput === "") {
	// 		let dateStr = localStorage.getItem("date");
	// 		localStorage.setItem("date", dateStr);
	// 		setPlaceholder(localStorage.getItem("date"));
	// 	}
	// }
};

function DateRange({ getHeaderGroups }) {
	const column = getHeaderGroups()
		.flatMap(({ headers }) => headers)
		.find(({ id }) => id === "created_at")?.column;

	if (!column) return null;

	const { setFilterValue, getFacetedMinMaxValues } = column;

	const [minValue, maxValue] = getFacetedMinMaxValues() || [];
	const oldStartDate = new Date(minValue || Date.now());
	const oldEndDate = new Date(maxValue || Date.now());

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

	const { years, months } = useMemo(() => {
		const years = Array.from(
			{
				length:
					oldEndDate.getFullYear() - oldStartDate.getFullYear() + 1,
			},
			(_, i) => i + oldStartDate.getFullYear()
		);

		const months = [
			"JAN",
			"FEB",
			"MAR",
			"APR",
			"MAY",
			"JUN",
			"JUL",
			"AUG",
			"SEP",
			"OCT",
			"NOV",
			"DEC",
		];

		return { years, months };
	}, [oldStartDate, oldEndDate]);

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
			<div className="flex w-full flex-row items-center justify-around gap-1 rounded-t-md bg-secondary py-1.5 shadow-md transition-all duration-100 ease-in-out">
				<Button
					onClick={decreaseMonth}
					disabled={prevMonthButtonDisabled}
				>
					{"<"}
				</Button>
				<Select
					value={format(date, "yyyy")}
					onChange={({ target: { value } }) => changeYear(value)}
					options={years}
				/>
				<Select
					value={months[format(date, "M") - 1]}
					onChange={({ target: { value } }) =>
						changeMonth(months.indexOf(value))
					}
					options={months}
				/>
				<Button
					onClick={increaseMonth}
					disabled={nextMonthButtonDisabled}
				>
					{">"}
				</Button>
			</div>
		);
	}

	return (
		<DatePicker
			className="input input-xs input-bordered input-primary flex w-auto items-center justify-between rounded-full font-semibold text-primary transition-all duration-100 ease-in-out"
			// className="flex items-center justify-between rounded-full border-2 border-primary px-2 py-0.5 text-xs font-semibold text-primary"
			minDate={oldStartDate}
			maxDate={oldEndDate}
			startDate={startDate}
			endDate={endDate}
			onChange={handleOnChange}
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

export default DateRange;
