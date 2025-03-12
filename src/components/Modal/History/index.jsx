import cn from '@/lib/cn';

import { Header } from '../ui';

function AddModal({
	id,
	title,
	subTitle = '',
	onClose,
	children,
	isSmall = false,
}) {
	return (
		<dialog
			id={id}
			className='modal modal-bottom max-h-screen overflow-hidden sm:modal-middle'
		>
			<div
				className={cn(
					'modal-box flex w-full flex-col justify-between bg-base-100 p-6 text-secondary-content',
					!isSmall && 'sm:max-w-5xl'
				)}
			>
				<Header title={title} subTitle={subTitle} onClose={onClose} />
				<div className='flex flex-col justify-between gap-2 pt-2 text-primary'>
					{children}
				</div>
			</div>
		</dialog>
	);
}

export default AddModal;
