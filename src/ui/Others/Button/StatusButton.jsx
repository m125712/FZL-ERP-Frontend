import { Check, Close } from '@/assets/icons';
import cn from '@lib/cn';

export default function StatusButton({ value = 0, showIdx = false, ...props }) {
	const numberValue = Number(value);
	const Icon = numberValue === 1 ? Check : Close;

	return (
		<button
			type='button'
			className={cn(
				`btn btn-circle bg-error font-semibold text-white`,
				numberValue === 1 && 'bg-primary',
				props.size
			)}
			{...props}>
			{showIdx ? props.idx : <Icon className='w-4' />}
		</button>
	);
}
