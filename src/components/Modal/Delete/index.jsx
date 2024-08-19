import { DeleteFooter, Header } from '../ui';

const Body = ({ item }) => (
	<p className='text-center text-2xl font-light text-black'>
		Do you want to delete <span className='font-semibold'>{item}</span>?
	</p>
);

export default function Index({
	modalId = '',
	title = '',
	url = '',
	deleteItem,
	setDeleteItem,
	deleteData,
	onSuccess,
}) {
	const handelClose = () => {
		setDeleteItem((prev) => ({
			...prev,
			itemId: null,
			itemName: null,
		}));
		window[modalId].close();
	};

	const handelCancelClick = () => {
		handelClose();
	};

	const onSubmit = async () => {
		await deleteData.mutateAsync({
			url: `${url}/${deleteItem?.itemId}`,
			onClose: handelClose,
		});

		onSuccess && onSuccess();
	};

	return (
		<dialog id={modalId} className='modal modal-bottom sm:modal-middle'>
			<form
				onSubmit={onSubmit}
				noValidate
				method='dialog'
				className='modal-box bg-secondary text-secondary-content'>
				<Header title={`Delete ${title}`} onClose={handelCancelClick} />
				<Body item={deleteItem?.itemName} />
				<DeleteFooter {...{ handelCancelClick }} />
			</form>
		</dialog>
	);
}
