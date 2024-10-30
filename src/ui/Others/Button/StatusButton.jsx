import cn from '@lib/cn';
import { Check, X } from 'lucide-react';

export default function StatusButton({
	value = 0,
	showIdx = false,
	className,
	...props
}) {
	const numberValue = Number(value);
	const Icon = numberValue === 1 ? Check : X;

	return (
		<button
			type='button'
			className={cn(
				`btn btn-circle border-none bg-error font-semibold text-white`,
				numberValue === 1 && 'bg-accent',
				props.size,
				className
			)}
			{...props}>
			{showIdx ? props.idx : <Icon className='size-5' />}
		</button>
	);
}
