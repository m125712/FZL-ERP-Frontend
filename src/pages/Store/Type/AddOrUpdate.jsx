import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useMaterialType, useMaterialTypeByUUID } from '@/state/Store';
import { Input } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { SECTION_NULL, SECTION_SCHEMA } from '@util/Schema';
import { useEffect } from 'react';

export default function Index({
	modalId = '',
	updateMaterialType = {
		uuid: null,
	},
	setUpdateMaterialType,
}) {
	const { user } = useAuth();
	const { url, updateData, postData } = useMaterialType();
	const { data } = useMaterialTypeByUUID(updateMaterialType?.uuid);

	const { register, handleSubmit, errors, reset, context } = useRHF(
		SECTION_SCHEMA,
		SECTION_NULL
	);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

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

		// New item
		const updatedData = {
			...data,
			uuid: nanoid(),
			created_at: GetDateTime(),
			created_by: user?.uuid,
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
					: 'Create Material Type'
			}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<Input label='name' {...{ register, errors }} />
			<Input label='short_name' {...{ register, errors }} />
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
