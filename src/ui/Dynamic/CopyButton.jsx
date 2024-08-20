import { Copy } from '@/assets/icons';

export default function RemoveButton({ showButton = true, onClick }) {
	if (!showButton) return null;
	return (
		<div className='flex items-center justify-end'>
			<Copy
				className='btn btn-circle btn-ghost btn-xs h-2'
				onClick={onClick}
			/>
		</div>
	);
}
