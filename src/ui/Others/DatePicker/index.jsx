import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';

import {
	DatePickerCustomHeader,
	DatePickerDefaultConfig,
} from '@/ui/Core/base';

import cn from '@/lib/cn';

const noop = () => {};

const SimpleDatePicker = ({
	className = '',
	selected,
	placeholder = '',
	onChange = noop,
	onChangeForTime = noop,
	disabled = false,
	showTime = false,
	timeIntervals = 30,
	props,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<DatePicker
			{...props}
			customInput={
				<ExampleCustomInput
					disabled={disabled}
					className={className}
					placeholder={placeholder}
					selected={selected}
				/>
			}
			disabled={disabled}
			selected={selected}
			onChange={(date) => {
				onChange(format(date, 'yyyy-MM-dd hh:mm:ss a'));
				onChangeForTime(date);

				// If you only want to close AFTER both date and time are selected,
				// you can decide here. Or keep it open and let the user click outside.
				// Example: close when time is set
				if (showTime) {
					setIsOpen(false);
				}
			}}
			renderCustomHeader={DatePickerCustomHeader}
			{...DatePickerDefaultConfig}
			showTimeSelect={showTime}
			timeFormat='hh a'
			timeIntervals={timeIntervals}
			dateFormat={showTime ? 'dd MMM, yy - hh a' : 'dd MMM, yy'}
			shouldCloseOnSelect={false} // still needed, but manual control is key
			open={isOpen}
			onClickOutside={() => setIsOpen(false)}
			onInputClick={() => setIsOpen(true)}
			menuPortalTarget={document.body}
			className='z-50'
		/>
	);
};

export default SimpleDatePicker;

const ExampleCustomInput = ({
	ref,
	value,
	onClick,
	disabled,
	className,
	placeholder,
}) => {
	return (
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
	);
};
