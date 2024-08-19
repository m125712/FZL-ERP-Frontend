import cn from '@/lib/cn';
import { Trash } from '@/assets/icons';

export default function RemoveButton({ showButton, onClick, className }) {
	if (!showButton) return null;
	return (
		<div className={cn('flex items-center justify-center', className)}>
			<Trash
				className='btn btn-circle btn-ghost btn-error btn-xs text-error'
				onClick={onClick}
			/>
		</div>
	);
}
