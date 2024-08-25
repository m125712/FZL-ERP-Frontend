import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useThreadMachine } from '@/state/Thread';

import { Input } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { DevTool } from '@hookform/devtools';
import { THREAD_MACHINE_NULL, THREAD_MACHINE_SCHEMA } from '@util/Schema';

export default function Index({
	modalId = '',
	updateMachine = {
		uuid: null,
	},
	setUpdateMachine,
}) {
	const { url, updateData, postData } = useThreadMachine();
	const { user } = useAuth();
	const { register, handleSubmit, errors, reset, control } = useRHF(
		THREAD_MACHINE_SCHEMA,
		THREAD_MACHINE_NULL
	);

	useFetchForRhfReset(
		`${url}/${updateMachine?.uuid}`,
		updateMachine?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateMachine((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(THREAD_MACHINE_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateMachine?.uuid !== null && updateMachine?.uuid !== undefined) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateMachine?.uuid}`,
				uuid: updateMachine?.uuid,
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
			title={updateMachine?.uuid !== null ? 'Update Machine' : 'Machine'}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<Input label='name' {...{ register, errors }} />
			<Input label='capacity' {...{ register, errors }} />

			<Input label='remarks' {...{ register, errors }} />

			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
