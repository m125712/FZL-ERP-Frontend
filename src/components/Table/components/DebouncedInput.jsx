import cn from "@lib/cn";
import { useEffect, useState } from "react";

function DebouncedInput({
	value: initialValue,
	onChange,
	debounce = 500,
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
				"input input-xs input-primary h-10 rounded-md border-[0.1px] border-primary p-2 text-sm text-primary duration-100 placeholder:text-primary placeholder:text-primary/40",
				props?.width ? props.width : "w-full"
			)}
			{...props}
		/>
	);
}

export default DebouncedInput;
