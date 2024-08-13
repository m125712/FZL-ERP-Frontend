import { AddModal } from '@/components/Modal';
import { useFetchForRhfReset, useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useMaterialType } from '@/state/Store';
import { Input } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { SECTION_NULL, SECTION_SCHEMA } from '@util/Schema';

export default function Index({
	modalId = '',
	updateMaterialType = {
		uuid: null,
	},
	setUpdateMaterialType,
}) {
	const { url, updateData, postData } = useMaterialType();
	const { register, handleSubmit, errors, reset } = useRHF(
		SECTION_SCHEMA,
		SECTION_NULL
	);

	useFetchForRhfReset(
		`/material/type/${updateMaterialType?.uuid}`,
		updateMaterialType?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateMaterialType((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(SECTION_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateMaterialType?.uuid !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateMaterialType?.uuid}`,
				uuid: updateMaterialType?.uuid,
				updatedData,
				onClose,
			});

			return;
		}

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
			title={
				updateMaterialType?.uuid !== null
					? 'Update Material Type'
					: 'Material Type'
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<Input label='name' {...{ register, errors }} />
			<Input label='short_name' {...{ register, errors }} />
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
