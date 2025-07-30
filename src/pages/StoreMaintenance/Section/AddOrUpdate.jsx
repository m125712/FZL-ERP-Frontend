import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useOtherMaterialSection } from '@/state/Other';
import { useMaterialSection, useMaterialSectionByUUID } from '@/state/Store';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input } from '@/ui';

import nanoid from '@/lib/nanoid';
import { SECTION_NULL, SECTION_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateSection = {
		uuid: null,
	},
	setUpdateSection,
}) {
	const { user } = useAuth();
	const { invalidateQuery: invalidateMaterialSection } =
		useOtherMaterialSection('maintenance');
	const { url, updateData, postData } = useMaterialSection();
	const { data } = useMaterialSectionByUUID(updateSection?.uuid);

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
		setUpdateSection((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(SECTION_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateSection?.uuid !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateSection?.uuid}`,
				uuid: updateSection?.uuid,
				updatedData,
				onClose,
			});

			return;
		}

		// New item
		const updatedData = {
			...data,
			uuid: nanoid(),
			store_type: 'maintenance',
			created_at: GetDateTime(),
			created_by: user?.uuid,
		};

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});

		invalidateMaterialSection();
	};

	return (
		<AddModal
			id={modalId}
			title={
				updateSection?.uuid !== null
					? 'Update Section'
					: 'Create Section'
			}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<Input label='index' {...{ register, errors }} />
			<Input label='name' {...{ register, errors }} />
			<Input label='short_name' {...{ register, errors }} />
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
