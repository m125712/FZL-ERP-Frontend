import cn from '@lib/cn';
import { useEffect, useState } from 'react';

function DebouncedInput({
	value: initialValue,
	onChange,
	debounce = 500,
	className,
	...props
}) {
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value);
		}, debounce);

		return () => clearTimeout(timeout);
	}, [value]);

	return (
		<input
			value={value}
			onChange={(e) => setValue(e.target.value)}
			className={cn(
				'input input-xs input-primary bg-base-100 h-10 rounded-md border-[1px] border-secondary/30 px-4 py-3 text-sm text-primary duration-100 placeholder:text-secondary focus:border-gray-300 focus:outline-secondary/30',
				props?.width ? props.width : 'w-full',
				className
			)}
			{...props}
		/>
	);
}

export default DebouncedInput;
