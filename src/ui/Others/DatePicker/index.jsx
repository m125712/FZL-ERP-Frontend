import { forwardRef } from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';

import {
	DatePickerCustomHeader,
	DatePickerDefaultConfig,
} from '@/ui/Core/base';

import cn from '@/lib/cn';

const SimpleDatePicker = ({
	className = '',
	selected,
	placeholder = '',
	onChange = () => {},
	onChangeForTime = () => {},
	disabled = false,
	showTime = false,
	timeIntervals = 30,
	props,
}) => {
	const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
		<button
			type='button'
			className={cn(
				'input input-secondary flex w-full items-center justify-between rounded border-secondary/30 bg-base-100 px-2 text-left text-sm text-primary transition-all duration-100 ease-in-out placeholder:text-sm placeholder:text-secondary/50',
				disabled
					? 'input-disabled cursor-not-allowed border-error'
					: 'cursor-pointer',
				className
			)}
			onClick={onClick}
			ref={ref}
		>
			{value ? value : placeholder ? placeholder : 'Select Date'}
			<Calendar className='mb-0.5 ml-1 w-4' />
		</button>
	));

	return (
		<DatePicker
			{...props}
			customInput={<ExampleCustomInput />}
			disabled={disabled}
			selected={selected}
			onChange={(date) => {
				onChange(format(date, 'yyyy-MM-dd HH:mm:ss'));
				onChangeForTime(date);
			}}
			renderCustomHeader={DatePickerCustomHeader}
			{...DatePickerDefaultConfig}
			showTimeSelect={showTime}
			timeFormat='HH:mm'
			timeIntervals={timeIntervals}
			// dateFormat={showTime ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'} // ✅ Adjust format accordingly
		/>
	);
};

export default SimpleDatePicker;
