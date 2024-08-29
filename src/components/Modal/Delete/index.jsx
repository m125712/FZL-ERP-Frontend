import { DeleteFooter, Header } from '../ui';

const Body = ({ item }) => (
	<p className='text-xl font-light text-black'>
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
	invalidateQuery = () => {},
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
		// console.log({
		// 	url: `${url}/${deleteItem?.itemId}`,
		// });

		await deleteData.mutateAsync({
			url: `${url}/${deleteItem?.itemId}`,
			onClose: handelClose,
		});
		onSuccess && onSuccess();
		invalidateQuery();
	};

	return (
		<dialog id={modalId} className='modal modal-bottom sm:modal-middle'>
			<form
				onSubmit={onSubmit}
				noValidate
				method='dialog'
				className='modal-box bg-base-100 text-error'>
				<Header title={`Delete ${title}`} onClose={handelCancelClick} />
				<Body item={deleteItem?.itemName} />
				<DeleteFooter {...{ handelCancelClick }} />
			</form>
		</dialog>
	);
}
