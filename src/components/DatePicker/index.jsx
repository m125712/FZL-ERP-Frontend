import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateFormate = (date) => format(date, "yyyy-MM-dd") + " 23:59:59";

const DefaultConfig = {
	dateFormat: "dd/MM/yy",
	isClearable: true,
	closeOnScroll: true,
	fixedHeight: true,
	weekDayClassName: () => "font-semibold text-primary",
	peekNextMonth: true,
};

function DateRange(props) {
	return (
		<DatePicker
			className="input input-xs input-bordered input-primary flex w-auto items-center justify-between rounded-full font-semibold text-primary transition-all duration-100 ease-in-out"
			{...DefaultConfig}
			{...props}
		/>
	);
}

export default DateRange;
