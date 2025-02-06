import { Copy, Trash2 } from 'lucide-react';

const FieldActionButton = ({ handleCopy, handleRemove, index }) => {
	return (
		<div className='flex items-center'>
			{handleCopy && (
				<button
					type='button'
					className='btn btn-square btn-ghost btn-sm rounded-full'
					onClick={() => handleCopy(index)}
				>
					<Copy className='size-4' />
				</button>
			)}
			{handleRemove && (
				<button
					className='btn btn-square btn-ghost btn-sm rounded-full'
					onClick={() => handleRemove(index)}
					type='button'
				>
					<Trash2 className='size-4' />
				</button>
			)}
		</div>
	);
};

export default FieldActionButton;
