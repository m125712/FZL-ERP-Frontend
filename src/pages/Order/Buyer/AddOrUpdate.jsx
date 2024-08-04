import { AddModal } from '@/components/Modal';
import { useFetchForRhfReset, useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useOrderBuyer } from '@/state/Order/buyer';
import { Input } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { DevTool } from '@hookform/devtools';
import { BUYER_NULL, BUYER_SCHEMA } from '@util/Schema';

export default function Index({
	modalId = '',
	updateBuyer = {
		uuid: null,
	},
	setUpdateBuyer,
}) {
	const { updateData, postData } = useOrderBuyer();
	// const { data, isLoading, isError, updateData } = useOrderBuyerById();
	const { register, handleSubmit, errors, reset, control } = useRHF(
		BUYER_SCHEMA,
		BUYER_NULL
	);

	useFetchForRhfReset(
		`/public/buyer/${updateBuyer?.uuid}`,
		updateBuyer?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateBuyer((prev) => ({
			...prev,
			id: null,
		}));
		reset(BUYER_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// console.log(updateBuyer?.uuid);

		// Update item
		if (updateBuyer?.uuid !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `/public/buyer/${updateBuyer?.uuid}/${data?.name}`,
				uuid: updateBuyer.uuid,
				updatedData,
				onClose,
			});

			return;
		}

		// Add new item
		const updatedData = {
			...data,
			created_at: GetDateTime(),
		};

		postData.mutate({
			url: '/public/buyer',
			newData: updatedData,
			onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updateBuyer?.uuid !== null ? 'Update Buyer' : 'Buyer'}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<Input label='name' {...{ register, errors }} />
			<Input label='short_name' {...{ register, errors }} />
			<Input label='remarks' {...{ register, errors }} />

			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
