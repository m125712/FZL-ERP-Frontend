import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useThreadCountLength } from '@/state/Thread';

import { Input } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { DevTool } from '@hookform/devtools';
import {
	THREAD_COUNT_LENGTH_NULL,
	THREAD_COUNT_LENGTH_SCHEMA,
} from '@util/Schema';

export default function Index({
	modalId = '',
	updateCountLength = {
		uuid: null,
	},
	setUpdateCountLength,
}) {
	const { url, updateData, postData } = useThreadCountLength();
	const { user } = useAuth();
	const { register, handleSubmit, errors, reset, control, context } = useRHF(
		THREAD_COUNT_LENGTH_SCHEMA,
		THREAD_COUNT_LENGTH_NULL
	);

	useFetchForRhfReset(
		`${url}/${updateCountLength?.uuid}`,
		updateCountLength?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateCountLength((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(THREAD_COUNT_LENGTH_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (
			updateCountLength?.uuid !== null &&
			updateCountLength?.uuid !== undefined
		) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateCountLength?.uuid}`,
				uuid: updateCountLength?.uuid,
				updatedData,
				onClose,
			});

			return;
		}

		// Add new item
		const updatedData = {
			...data,
			uuid: nanoid(),
			created_by: user?.uuid,
			created_by_name: user?.name,
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
				updateCountLength?.uuid !== null
					? 'Update Count Length'
					: 'Count Length'
			}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<Input label='count' {...{ register, errors }} />
			<Input label='length' {...{ register, errors }} />
			<Input label='weight' {...{ register, errors }} />
			<Input label='sst' {...{ register, errors }} />
			<Input label='remarks' {...{ register, errors }} />

			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
