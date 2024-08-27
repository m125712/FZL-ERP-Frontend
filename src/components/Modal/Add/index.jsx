import cn from '@lib/cn';
import { Footer, Header } from '../ui';

function AddModal({
	id,
	title,
	onSubmit,
	onClose,
	children,
	isSmall = false,
	formClassName,
}) {
	return (
		<dialog
			id={id}
			className='modal modal-bottom sm:modal-middle max-h-screen overflow-hidden'>
			<form
				onSubmit={onSubmit}
				noValidate
				method='dialog'
				className={cn(
					'modal-box text-secondary-content flex w-full flex-col justify-between bg-gray-50 p-6',
					!isSmall && 'sm:max-w-5xl',
					formClassName
				)}>
				<Header title={title} onClose={onClose} />
				<div className='flex flex-col justify-between gap-2'>
					{children}
				</div>
				<Footer />
			</form>
		</dialog>
	);
}

export default AddModal;
