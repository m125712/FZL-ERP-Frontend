import { useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

const useSubmitDisabled = () => {
	const form = useFormContext();
	const queryClient = useQueryClient();

	const isMutating =
		queryClient.isMutating({
			status: 'pending',
		}) < 0;
	const isSubmitting = form?.formState?.isSubmitting;
	const isDirty = form?.formState?.isDirty === false;

	return {
		isMutating,
		isSubmitting,
		isDirty,
	};
};

const Header = ({ title, subTitle, onClose }) => {
	const { isMutating, isSubmitting } = useSubmitDisabled();

	return (
		<div className='modal-header mb-2 flex items-center justify-between'>
			<div className='flex flex-col'>
				<p className='text-2xl font-semibold text-primary'>{title}</p>
				{subTitle && (
					<p className='font-semibold text-gray-400'>{subTitle}</p>
				)}
			</div>

			<button
				disabled={isSubmitting || isMutating}
				type='button'
				onClick={onClose}
				className='group btn btn-circle btn-outline btn-error btn-sm'>
				<X className='size-5 text-error group-hover:text-primary-content' />
			</button>
		</div>
	);
};

const Footer = () => {
	const { isMutating, isSubmitting, isDirty } = useSubmitDisabled();

	return (
		<div className='modal-action'>
			<button
				disabled={isDirty || isSubmitting || isMutating}
				type='submit'
				className='text-md btn btn-accent btn-block'>
				Save
			</button>
		</div>
	);
};

const DeleteFooter = ({ handelCancelClick }) => (
	<div className='modal-action'>
		<button
			type='button'
			onClick={handelCancelClick}
			className='btn btn-outline btn-primary'>
			Cancel
		</button>

		<button type='submit' className='btn bg-error text-white'>
			Delete
		</button>
	</div>
);

const ProceedFooter = ({ handelCancelClick }) => (
	<div className='modal-action'>
		<button
			type='button'
			onClick={handelCancelClick}
			className='btn btn-outline border-primary text-primary hover:bg-primary'>
			Cancel
		</button>

		<button type='submit' className='btn bg-success text-white'>
			Proceed
		</button>
	</div>
);

export { DeleteFooter, Footer, Header, ProceedFooter };
