import { useAuth } from '@/context/auth';
import { useOtherCountLength } from '@/state/Other';
import { useFetchForRhfReset, useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import GetDateTime from '@/util/GetDateTime';

import { useThreadCountLength } from './config/query';
import {
	THREAD_COUNT_LENGTH_NULL,
	THREAD_COUNT_LENGTH_SCHEMA,
} from './config/schema';

export default function Index({
	modalId = '',
	updateCountLength = {
		uuid: null,
	},
	setUpdateCountLength,
}) {
	const { url, updateData, postData } = useThreadCountLength();
	const { invalidateQuery: invalidateOtherCountLength } =
		useOtherCountLength();
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
				updated_by: user?.uuid,
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

			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});
		invalidateOtherCountLength();
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
			isSmall={true}
		>
			<Input label='count' {...{ register, errors }} />
			<Input label='length' {...{ register, errors }} />
			<Input label='min_weight' {...{ register, errors }} />
			<Input label='max_weight' {...{ register, errors }} />
			<Input label='cone_per_carton' {...{ register, errors }} />
			<Input label='price' {...{ register, errors }} />
			<Input label='sst' {...{ register, errors }} />
			<Input label='remarks' {...{ register, errors }} />

			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
