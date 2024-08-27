import { Close } from '@/assets/icons';

const Header = ({ title, onClose }) => (
	<div className='modal-header mb-2 flex items-center justify-between'>
		<p className='text-2xl font-semibold text-primary'>{title}</p>
		<button
			type='button'
			onClick={onClose}
			className='btn btn-circle btn-outline btn-error btn-sm group'>
			<Close className='text-error group-hover:text-primary-content h-5 w-5' />
		</button>
	</div>
);

const Footer = () => (
	<div className='modal-action'>
		<button type='submit' className='text-md btn btn-primary btn-block'>
			Save
		</button>
	</div>
);

const DeleteFooter = ({ handelCancelClick }) => (
	<div className='modal-action'>
		<button
			type='button'
			onClick={handelCancelClick}
			className='btn btn-outline border-primary text-primary hover:bg-primary'>
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

export { DeleteFooter, ProceedFooter, Footer, Header };
