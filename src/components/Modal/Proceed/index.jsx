import { ProceedFooter } from '../ui';

const Body = ({ text }) => (
	<p className='text-xl font-light text-black'>
		Not all items have the{' '}
		<span className='font-semibold'> same {text ? text : 'color'}</span>. Do
		you want to proceed?
	</p>
);

export default function Index({ modalId = '', setProceed, text = '' }) {
	const handelClose = () => {
		window[modalId].close();
	};

	const handelCancelClick = () => {
		handelClose();
	};

	const onSubmit = async () => {
		setProceed(true);
	};

	return (
		<dialog id={modalId} className='modal modal-bottom sm:modal-middle'>
			<form
				onSubmit={onSubmit}
				noValidate
				method='dialog'
				className='modal-box bg-gray-50 text-error'>
				<Body text={text} />
				<ProceedFooter {...{ handelCancelClick }} />
			</form>
		</dialog>
	);
}
