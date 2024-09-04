import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF } from '@/hooks';

import { useDyeingThreadBatch } from '@/state/Dyeing';
import { Input } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { DevTool } from '@hookform/devtools';
import {
	DYEING_THREAD_BATCH_YARN_NULL,
	DYEING_THREAD_BATCH_YARN_SCHEMA,
} from '@util/Schema';

export default function Index({
	modalId = '',
	yarn = {
		uuid: null,
		yarn_quantity: null,
		batch_id: null,
	},
	setYarn,
}) {
	const { url, updateData } = useDyeingThreadBatch();

	const { user } = useAuth();

	//const MAX_QUANTITY = yarn?.tape_making;

	// const schema = {
	// 	used_quantity: DYEING_THREAD_BATCH_YARN_SCHEMA.remaining.max(yarn?.tape_making),
	// 	wastage: DYEING_THREAD_BATCH_YARN_SCHEMA.remaining.max(
	// 		MAX_QUANTITY,
	// 		'Must be less than or equal ${MAX_QUANTITY}'
	// 	),
	// };

	const { register, handleSubmit, errors, reset, control } = useRHF(
		//schema,
		DYEING_THREAD_BATCH_YARN_SCHEMA,
		DYEING_THREAD_BATCH_YARN_NULL
	);
	useFetchForRhfReset(`${url}/${yarn?.uuid}`, yarn?.uuid, reset);

	const onClose = () => {
		setYarn((prev) => ({
			...prev,
			uuid: null,
			yarn_quantity: null,
			batch_id: null,
		}));
		reset(DYEING_THREAD_BATCH_YARN_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		console.log(yarn, 'onsubmit');
		if (Number(yarn?.yarn_quantity) !== 0) {
			const updatedData = {
				uuid: yarn?.uuid,
				yarn_quantity: data?.yarn_quantity,
				yarn_issue_updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${yarn?.uuid}`,
				uuid: yarn?.uuid,
				updatedData,
				onClose,
			});

			return;
		} else {
			const updatedData = {
				uuid: yarn?.uuid,
				yarn_quantity: data?.yarn_quantity,
				yarn_issue_created_at: GetDateTime(),
				yarn_issue_created_by: user?.uuid,
			};

			await updateData.mutateAsync({
				url: `${url}/${yarn?.uuid}`,
				uuid: yarn?.uuid,
				updatedData,
				onClose,
			});

			return;
		}
	};

	return (
		<AddModal
			id={modalId}
			title={
				Number(yarn?.yarn_quantity) !== 0
					? `Update Yarn on ${yarn?.batch_id} `
					: `Yarn Issue on ${yarn?.batch_id} `
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<Input label='yarn_quantity' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
