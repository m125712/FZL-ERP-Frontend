import { format } from 'date-fns';
import DatePicker from 'react-datepicker';

import { DatePickerDefaultConfig } from '@/ui/Core/base';

const MultiCalendar = ({
	selected,
	onChange = () => {},
	monthsShown = 2,
	disabled = false,
	...props
}) => {
	return (
		<DatePicker
			{...props}
			disabled={disabled}
			selected={selected}
			onChange={(date) => {
				onChange(format(date, 'yyyy-MM-dd HH:mm:ss'));
			}}
			inline
			monthsShown={monthsShown}
			{...DatePickerDefaultConfig}
		/>
	);
};

export default MultiCalendar;
