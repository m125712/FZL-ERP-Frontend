import cn from '@lib/cn';
import { Footer, Header } from '../ui';
import { FormProvider } from 'react-hook-form';

function AddModal({
	id,
	title,
	subTitle = '',
	formContext,
	onSubmit,
	onClose,
	children,
	isSmall = false,
	formClassName,
}) {
	return (
		<dialog
			id={id}
			className='modal modal-bottom max-h-screen overflow-hidden sm:modal-middle'>
			<FormProvider {...formContext}>
				<form
					onSubmit={onSubmit}
					noValidate
					method='dialog'
					className={cn(
						'modal-box flex w-full flex-col justify-between bg-base-100 p-6 text-secondary-content',
						!isSmall && 'sm:max-w-5xl',
						formClassName
					)}>
					<Header
						title={title}
						subTitle={subTitle}
						onClose={onClose}
					/>
					<div className='flex flex-col justify-between gap-2 pt-2'>
						{children}
					</div>
					<Footer />
				</form>
			</FormProvider>
		</dialog>
	);
}

export default AddModal;
