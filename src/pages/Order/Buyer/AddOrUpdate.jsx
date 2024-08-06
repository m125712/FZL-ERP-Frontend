import { AddModal } from '@/components/Modal';
import { useFetchForRhfReset, useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useOrderBuyer } from '@/state/Order';
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
	const { url, updateData, postData } = useOrderBuyer();
	const { register, handleSubmit, errors, reset, control } = useRHF(
		BUYER_SCHEMA,
		BUYER_NULL
	);

	useFetchForRhfReset(
		`${url}/${updateBuyer?.uuid}`,
		updateBuyer?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateBuyer((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(BUYER_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateBuyer?.uuid !== null && updateBuyer?.uuid !== undefined) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateBuyer?.uuid}`,
				uuid: updateBuyer?.uuid,
				updatedData,
				onClose,
			});

			return;
		}

		// Add new item
		const updatedData = {
			...data,
			uuid: nanoid(),
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url,
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
