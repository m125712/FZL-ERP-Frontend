import { Check, X } from 'lucide-react';

import cn from '@lib/cn';

export default function StatusButton({
	value = 0,
	showIdx = false,
	className,
	...props
}) {
	let res;
	if (typeof value === 'string') {
		res = Boolean(value);
	} else {
		res = Number(value);
	}
	const isTrue = res === 1 || res === true;

	const Icon = isTrue ? Check : X;

	return (
		<button
			type='button'
			className={cn(
				`btn btn-circle border-none bg-error font-semibold text-white`,
				isTrue && 'bg-accent',
				props.size,
				className
			)}
			{...props}>
			{showIdx ? props.idx : <Icon className='size-5' />}
		</button>
	);
}
